import fetch from "node-fetch";

async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/generate-lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "general",
        weakKeys: ["a", "s"],
        difficulty: "intermediate"
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

run();
