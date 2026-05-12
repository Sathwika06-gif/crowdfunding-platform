import React, { useState, useRef } from "react";

function Creator() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([""]);

  const [language, setLanguage] = useState("en");
    const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [fullDescription, setFullDescription] = useState("");

  //const [titleTranslations, setTitleTranslations] = useState({});
  //const [translations, setTranslations] = useState({});
  //const [fullTranslations, setFullTranslations] = useState({});

  const [listeningField, setListeningField] = useState(null);
  const recognitionRef = useRef(null);

  // ================= AUTO TRANSLATE =================
  const autoTranslateAll = async (text) => {
    if (!text) return {};

    try {
      const [teRes, hiRes] = await Promise.all([
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|te`),
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`)
      ]);

      const teData = await teRes.json();
      const hiData = await hiRes.json();

      return {
        en: text,
        te: teData.responseData?.translatedText || "",
        hi: hiData.responseData?.translatedText || ""
      };
    } catch (e) {
      console.error(e);
      return { en: text };
    }
  };

  // ================= VOICE =================
 const startVoiceInput = (field) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Use Chrome for voice");
    return;
  }

  const recognition = new SpeechRecognition();
  recognitionRef.current = recognition;

  recognition.lang = "en-IN";
  recognition.start();

  setListeningField(field);

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;

    if (field === "title") setTitle(text);
    if (field === "desc") setDescription(text);
    if (field === "full") setFullDescription(text);

    setListeningField(null);
  };

  recognition.onend = () => setListeningField(null);
};

 const stopVoiceInput = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
  setListeningField(null);
};

  // ================= INPUT =================
  //const handleTitleChange = async (text) => {
   // const translated = await autoTranslateAll(text);

  //  setTitleTranslations(prev => ({
   //   ...prev,
   //   ...translated
  //  }));
  //};

 // const handleDescChange = async (text) => {
  //  const translated = await autoTranslateAll(text);

  //  setTranslations(prev => ({
   //   ...prev,
   //   ...translated
   // }));
  //};

  //const handleFullChange = async (text) => {
  //  const translated = await autoTranslateAll(text);

   // setFullTranslations(prev => ({
   //   ...prev,
   //   ...translated
   // }));
 // };

  // ================= IMAGE =================
  const addImageField = () => {
    setImages([...images, ""]);
  };

  const handleImageChange = (i, val) => {
    const updated = [...images];
    updated[i] = val;
    setImages(updated);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
  if (!title || !description || !amount) {
    alert("Fill required fields");
    return;
  }

  // Always treat input as English source
  const titleTranslated = await autoTranslateAll(title);
  const descTranslated = await autoTranslateAll(description);
  const fullTranslated = await autoTranslateAll(fullDescription);

  await fetch("http://127.0.0.1:5000/create-campaign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titleTranslated.en,   // 🔥 always save English main
      description: descTranslated.en,
      fullDescription: fullTranslated.en,

      title_translations: titleTranslated,
      description_translations: descTranslated,
      full_translations: fullTranslated,

      amount: parseInt(amount),
      images,
      category,
      language
    })
  });

  alert(`Saved in ${language.toUpperCase()} ✅`);

  setTitle("");
  setDescription("");
  setFullDescription("");
  setAmount("");
  setImages([""]);
};

  return (
  <div style={page}>
      <div style={glassCard}>
        <h1 style={heading}>
  Create Campaign 🚀
</h1>

<p style={subHeading}>
  Start raising funds for your cause
</p>

        {/* TITLE */}
        <input
          placeholder="Title"
          value={title}
onChange={(e) => setTitle(e.target.value)}
          style={modernInput}
        />

       <button
  onClick={() =>
    listeningField === "title"
      ? stopVoiceInput()
      : startVoiceInput("title")
  }
  style={
  listeningField
    ? activeVoiceBtn
    : voiceModernBtn
}
>
  {listeningField === "title" ? "🛑 Stop Title" : "🎤 Speak Title"}
</button>

        {/* LANGUAGE */}
      
        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
onChange={(e) => setDescription(e.target.value)}
         style={{ ...modernInput, height: "90px" }}
        />

        <button
  onClick={() =>
    listeningField === "desc"
      ? stopVoiceInput()
      : startVoiceInput("desc")
  }
  style={
  listeningField
    ? activeVoiceBtn
    : voiceModernBtn
}
>
  {listeningField === "desc"
    ? "🛑 Stop Description"
    : "🎤 Speak Description"}
</button>

        {/* FULL */}
        <textarea
          placeholder="Full Description"
          value={fullDescription}
onChange={(e) => setFullDescription(e.target.value)}
          style={{ ...modernInput, height: "120px" }}
        />

       <button
  onClick={() =>
    listeningField === "full"
      ? stopVoiceInput()
      : startVoiceInput("full")
  }
  style={
  listeningField
    ? activeVoiceBtn
    : voiceModernBtn
}
>
  {listeningField === "full"
    ? "🛑 Stop Full Description"
    : "🎤 Speak Full Description"}
</button>
        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
style={modernInput}
        />

        {/* IMAGES */}
        {images.map((img, i) => (
          <input
            key={i}
            placeholder={`Image ${i + 1}`}
            value={img}
            onChange={(e) => handleImageChange(i, e.target.value)}
            style={modernInput}
          />
        ))}

        <button onClick={addImageField} style={secondaryModernBtn}>+ Add Image</button>

        {/* CATEGORY */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={modernInput}>
          <option value="">Category</option>
          <option value="education">Education</option>
          <option value="medical">Medical</option>
            <option value="Technology">Technology</option>
          <option value="animal">Animal</option>
          <option value="environment">Environment</option>
        </select>

        <button onClick={handleSubmit} style={createBtn}>
          Create Campaign
        </button>
      </div>
    </div>
  );
}


const container = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" };
const card = { width: "350px", padding: "20px", background: "white", borderRadius: "10px" };
const input = { width: "100%", padding: "10px", margin: "8px 0" };
const button = { width: "100%", padding: "10px", background: "#007bff", color: "white" };
const secondaryBtn = { width: "100%", padding: "8px", background: "#6c757d", color: "white" };
const voiceBtn = { width: "100%", padding: "8px", background: "#28a745", color: "white", marginBottom: "10px" };
// ================= MODERN STYLES =================

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  padding: "40px 20px"
};

const glassCard = {
  width: "100%",
  maxWidth: "600px",
  padding: "35px",
  borderRadius: "25px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.8s ease",
  border: "1px solid rgba(255,255,255,0.2)"
};

const heading = {
  fontSize: "36px",
  color: "white",
  marginBottom: "10px",
  textAlign: "center",
  fontWeight: "bold"
};

const subHeading = {
  color: "#f1f1f1",
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "16px"
};

const modernInput = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  background: "rgba(255,255,255,0.9)",
  boxSizing: "border-box",
  transition: "0.3s",

  // ✅ Added
  color: "black",
  caretColor: "black"
};

const createBtn = {
  width: "100%",
  padding: "14px",
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  marginTop: "10px",
  transition: "0.3s",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

const secondaryModernBtn = {
  width: "100%",
  padding: "12px",
  background: "#34495e",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  marginBottom: "15px",
  fontWeight: "bold"
};

const voiceModernBtn = {
  width: "100%",
  padding: "12px",
  background: "#2ecc71",
  color: "white",
  border: "none",
  borderRadius: "12px",
  marginBottom: "15px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s"
};

const activeVoiceBtn = {
  width: "100%",
  padding: "12px",
  background: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "12px",
  marginBottom: "15px",
  cursor: "pointer",
  fontWeight: "bold",
  animation: "pulse 1s infinite"
};

export default Creator;