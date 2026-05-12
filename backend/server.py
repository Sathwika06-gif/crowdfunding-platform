from flask_caching import Cache
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import random
import razorpay
import requests  # add this at top
app = Flask(__name__)
CORS(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
def translate(text, target):
    try:
        import requests

        res = requests.post(
            "https://libretranslate.de/translate",
            json={
                "q": text,
                "source": "en",
                "target": target,
                "format": "text"
            }
        )

        data = res.json()
        return data.get("translatedText", text)

    except:
        return text

#====razorpay===
razorpay_client = razorpay.Client(
    auth=("rzp_test_SfHZo74uWOERAI", "yQSTBhA6priFboXUlxFdYmBW")
)
# ================================
# MongoDB CONNECTION (SAFE)
# ================================
try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["crowdfunding"]
    collection = db["campaigns"]
    users = db["users"]
    print("✅ MongoDB Connected")
except:
    print("❌ MongoDB NOT running")

# ================================
# USERS COLLECTION
# ================================
users = db["users"]
# ================================
# OTP STORE

otp_store = {}
# ================================
# FRAUD DETECTION
# ================================
def detect_fraud(data):
    text = f"{data.get('title','')} {data.get('description','')}".lower()

    suspicious_words = [
        "urgent", "emergency", "help pls",
        "money needed", "immediately", "hospital"
    ]

    score = 0

    for word in suspicious_words:
        if word in text:
            score += 20

    if text.count("!") > 2:
        score += 10

    fraud = score >= 30

    return {
        "fraud": fraud,
        "fraud_score": score,
        "fraud_alert": fraud
    }

# ================================
# AUTH APIs
# ================================
@app.route('/register', methods=['POST'])
def register():
    data = request.json

    if users.find_one({"email": data.get("email")}):
        return jsonify({"error": "User exists"}), 400

    users.insert_one({
        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password"),
        "dob": data.get("dob"),
        "phone": data.get("phone"),
        "role": data.get("role", "user"),
        "profileImage": None
    })

    return jsonify({"message": "Registered"})


@app.route('/login', methods=['POST'])
def login():
    data = request.json

    user = users.find_one({
        "email": data.get("email"),
        "password": data.get("password")
    })

    if user:
        # ✅ Generate OTP
        otp = str(random.randint(1000, 9999))
        otp_store[data.get("email")] = otp

        print(f"🔐 OTP for {data.get('email')}: {otp}")

        return jsonify({
            "message": "OTP sent",
            "otp_required": True
        })

    return jsonify({"error": "Invalid credentials"}), 401
# ================================
# OTP APIs
# ================================


@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    otp = str(random.randint(1000, 9999))
    otp_store[email] = otp

    print(f"🔐 OTP for {email}: {otp}")

    return jsonify({"message": "OTP sent"})


@app.route('/verify-login-otp', methods=['POST'])
def verify_login_otp():

    data = request.json

    email = data.get("email")
    otp = data.get("otp")

    # ✅ verify otp
    if otp_store.get(email) == otp:

        user = users.find_one({"email": email})

        # ✅ remove otp after login
        otp_store.pop(email, None)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # ✅ RETURN FULL USER DATA
        return jsonify({
            "message": "Login success",
            "user": {
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "role": user.get("role", ""),

                # ✅ IMPORTANT
                "dob": user.get("dob", ""),
                "phone": user.get("phone", ""),

                # ✅ image
                "profileImage": user.get("profileImage", "")
            }
        })

    return jsonify({"error": "Invalid OTP"}), 400
# ================================
# PROFILE APIs
# ================================
@app.route('/user/<email>', methods=['GET'])
def get_user(email):
    user = users.find_one({"email": email})

    if user:
        user["_id"] = str(user["_id"])
        return jsonify(user)

    return jsonify({"error": "Not found"}), 404


@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json

    users.update_one(
        {"email": data.get("email")},
        {"$set": {
            "name": data.get("name"),
            "dob": data.get("dob"),
            "phone": data.get("phone")
        }}
    )

    return jsonify({"message": "Updated"})


@app.route('/update-profile-image', methods=['POST'])
def update_profile_image():
    data = request.json

    users.update_one(
        {"email": data.get("email")},
        {"$set": {"profileImage": data.get("image")}}
    )

    return jsonify({"message": "Image updated"})


@app.route('/remove-profile-image', methods=['POST'])
def remove_profile_image():
    data = request.json

    users.update_one(
        {"email": data.get("email")},
        {"$set": {"profileImage": None}}
    )

    return jsonify({"message": "Removed"})


@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.json

    user = users.find_one({"email": data.get("email")})

    if user and user.get("password") == data.get("oldPassword"):
        users.update_one(
            {"email": data.get("email")},
            {"$set": {"password": data.get("newPassword")}}
        )
        return jsonify({"message": "Password updated"})

    return jsonify({"error": "Wrong password"}), 400


# ================================
# CAMPAIGNS
# ================================
def convert_id(c):
    c["_id"] = str(c["_id"])
    return c


@app.route('/campaigns', methods=['GET'])
@cache.cached(timeout=60)
def get_campaigns():

    campaigns = list(
        collection.find().limit(20)
    )

    result = []

    for c in campaigns:

        c = convert_id(c)

        # ✅ AUTO TRANSLATE OLD DATA
        if not c.get("title_translations"):
            c["title_translations"] = {
                "en": c.get("title"),
                "te": translate(c.get("title"), "te"),
                "hi": translate(c.get("title"), "hi")
            }

        if not c.get("description_translations"):
            c["description_translations"] = {
                "en": c.get("description"),
                "te": translate(c.get("description"), "te"),
                "hi": translate(c.get("description"), "hi")
            }

        if not c.get("full_translations"):
            c["full_translations"] = {
                "en": c.get("fullDescription"),
                "te": translate(c.get("fullDescription"), "te"),
                "hi": translate(c.get("fullDescription"), "hi")
            }

        fraud_result = detect_fraud(c)

        c["fraud"] = fraud_result["fraud"]
        c["fraud_score"] = fraud_result["fraud_score"]
        c["fraud_alert"] = fraud_result["fraud_alert"]

        result.append(c)

    return jsonify(result)

@app.route('/create-campaign', methods=['POST'])
def create_campaign():
    data = request.json

    fraud_result = detect_fraud(data)

    campaign = {
       "title": data.get("title"),
"title_translations": data.get("title_translations", {}),

"description": data.get("description"),
"description_translations": data.get("description_translations", {}),

"fullDescription": data.get("fullDescription"),
"full_translations": data.get("full_translations", {}),
        "amount": int(data.get("amount") or 0),
        "images": data.get("images", []),
        "category": data.get("category", "general"),
        "raised": 0,
        "fraud": fraud_result["fraud"],
        "fraud_score": fraud_result["fraud_score"],
        "fraud_alert": fraud_result["fraud_alert"]
    }

    collection.insert_one(campaign)

    return jsonify({"message": "Created"})


@app.route('/donate', methods=['POST'])
def donate():
    data = request.json

    print("DONATION:", data)  # 🔥 DEBUG

    collection.update_one(
        {"_id": ObjectId(data.get("id"))},
        {"$inc": {"raised": int(data.get("amount") or 0)}}
    )

    return jsonify({"message": "Donation successful"})

# ================================
# RECOMMENDATIONS
# ================================
@app.route('/recommendations/<category>', methods=['GET'])
def recommendations(category):

    campaigns = list(
        collection.find({
            "category": category
        }).limit(12)
    )

    result = []

    for c in campaigns:

        c["_id"] = str(c["_id"])

        c["title_translations"] = c.get(
            "title_translations", {}
        )

        c["description_translations"] = c.get(
            "description_translations", {}
        )

        c["full_translations"] = c.get(
            "full_translations", {}
        )

        result.append(c)

    return jsonify(result)
# ================================
# BOOKMARKS
# ================================
@app.route('/bookmark', methods=['POST'])
def bookmark():
    data = request.json

    collection.update_one(
        {"_id": ObjectId(data.get("id"))},
        {"$addToSet": {"bookmarkedBy": data.get("user")}}
    )

    return jsonify({"message": "Bookmarked"})


@app.route('/unbookmark', methods=['POST'])
def unbookmark():
    data = request.json

    collection.update_one(
        {"_id": ObjectId(data.get("id"))},
        {"$pull": {"bookmarkedBy": data.get("user")}}
    )

    return jsonify({"message": "Removed"})


@app.route('/bookmarks/<user>', methods=['GET'])
def get_bookmarks(user):
    campaigns = list(collection.find({"bookmarkedBy": user}))
    return jsonify([convert_id(c) for c in campaigns])


# ================================
# ADMIN STATS
# ================================
@app.route('/admin-stats', methods=['GET'])
def admin_stats():
    campaigns = list(collection.find())

    total_required = 0
    total_raised = 0
    fraud_count = 0
    clean_count = 0
    bar_data = []

    for c in campaigns:
        required = c.get("amount", 0)
        raised = c.get("raised", 0)

        total_required += required
        total_raised += raised

        if c.get("fraud"):
            fraud_count += 1
        else:
            clean_count += 1

        bar_data.append({
            "name": c.get("title", "")[:10],
            "required": required,
            "raised": raised
        })

    return jsonify({
        "total_required": total_required,
        "total_raised": total_raised,
        "fraud_count": fraud_count,
        "clean_count": clean_count,
        "bar_data": bar_data
    })


@app.route('/delete-campaign/<id>', methods=['DELETE'])
def delete_campaign(id):
    data = request.json

    if data.get("admin_key") != "admin123":
        return jsonify({"error": "Unauthorized"}), 403

    collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Deleted"})
@app.route('/create-order', methods=['POST'])
def create_order():
    try:
        data = request.json
        amount = int(data.get("amount")) * 100  # convert to paise

        order = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        })

        return jsonify(order)

    except Exception as e:
        print("ORDER ERROR:", e)
        return jsonify({"error": "Order creation failed"}), 500

# ================================
# RUN
# ================================
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)