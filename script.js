document.addEventListener("DOMContentLoaded", () => {
  const promptinput = document.getElementById("prompt");
  const styleselect = document.getElementById("artStyle");
  const resolutionselect = document.getElementById("resolution");
  const qualityselect = document.getElementById("quality");
  const countselect = document.getElementById("count");
  const generatebtn = document.getElementById("generatebtn");
  const resultsdiv = document.getElementById("results");
  const loadingspinner = document.querySelector(".loading-spinner");
  const btntext = document.querySelector(".btn-text");

  let isgenerating = false;

  // 🔄 Restore last generated session
  restoreLastSession();

  generatebtn.addEventListener("click", generateimages);
  promptinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.ctrlKey) generateimages();
  });

  function generateimages() {
    const prompt = promptinput.value.trim();
    if (!prompt) {
      showstatusmessage("error", "Please enter a description for your image");
      return;
    }
    if (isgenerating) return;

    isgenerating = true;
    generatebtn.disabled = true;
    loadingspinner.style.display = "inline-block";
    btntext.textContent = "Generating...";

    resultsdiv.innerHTML = "";
    showstatusmessage("info", "Generating your images... This may take a few seconds");

    setTimeout(() => {
      const imagecount = parseInt(countselect.value);
      const resolution = resolutionselect.value;
      const style = styleselect.value;
      const quality = qualityselect.value;

      generateimagecards(prompt, imagecount, resolution, style, quality);

      isgenerating = false;
      generatebtn.disabled = false;
      loadingspinner.style.display = "none";
      btntext.textContent = "Generate Image";
    }, 2000);
  }

  async function generateimagecards(prompt, count, resolution, style, quality) {
    const imagegrid = document.createElement("div");
    imagegrid.className = "image-grid";
    const generatedUrls = [];

    for (let i = 0; i < count; i++) {
      const imagecard = document.createElement("div");
      imagecard.className = "image-card";

      const enhanceprompt = `${prompt}, ${style} style, ${quality} quality, detailed`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        enhanceprompt
      )}?width=${resolution.split("x")[0]}&height=${resolution.split("x")[1]}&seed=${
        Date.now() + i
      }&nologo=true`;

      generatedUrls.push(imageUrl);

      imagecard.innerHTML = `
        <div class="image-container" style="position: relative; overflow: hidden">
          <img src="${imageUrl}" alt="Generated image"
            style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px 8px 0 0;"
            loading="lazy" />
          <div class="image-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.7); opacity: 0; display: flex; justify-content: center;
            align-items: center; color: #fff; font-size: 1rem; transition: opacity 0.3s;">
            Click to view full image
          </div>
        </div>
        <div class="image-info">
          <div class="image-prompt">${prompt}</div>
          <div class="image-details">
            <span>Resolution: ${resolution}</span>
            <span>Style: ${style}</span>
            <span>Quality: ${quality}</span>
          </div>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem">
            <button onclick="downloadimage('${imageUrl}', '${prompt.substring(0, 30)}')"
              style="flex: 1; padding: 0.5rem; background-color: #30a4ec; color: white; border: none;
              border-radius: 4px; cursor: pointer;">Download</button>
            <button onclick="openimagemodal('${imageUrl}', '${prompt.substring(0, 30)}')"
              style="flex: 1; padding: 0.5rem; background-color: #333; color: white; border: none;
              border-radius: 4px; cursor: pointer;">View Full</button>
          </div>
        </div>
      `;

      imagecard.addEventListener("mouseenter", () => {
        const overlay = imagecard.querySelector(".image-overlay");
        if (overlay) overlay.style.opacity = "1";
      });
      imagecard.addEventListener("mouseleave", () => {
        const overlay = imagecard.querySelector(".image-overlay");
        if (overlay) overlay.style.opacity = "0";
      });

      imagegrid.appendChild(imagecard);
    }

    resultsdiv.appendChild(imagegrid);

    // 💾 Save generated data in localStorage
    saveLastSession(prompt, count, resolution, style, quality, generatedUrls);
  }

  function showstatusmessage(type, message) {
    const existingmsg = document.querySelector(".status-message");
    if (existingmsg) existingmsg.remove();

    const statusdiv = document.createElement("div");
    statusdiv.className = `status-message status-${type}`;
    statusdiv.textContent = message;
    resultsdiv.insertBefore(statusdiv, resultsdiv.firstChild);

    if (type === "success" || type === "info") {
      setTimeout(() => statusdiv.remove(), 5000);
    }
  }

  const samplePrompts = [
    "A majestic mountain landscape at golden hour with a crystal clear lake reflecting the peaks",
    "A futuristic robot sitting in a cozy library reading a book",
    "An ancient Japanese temple surrounded by cherry blossoms in full bloom",
    "A steampunk airship floating above a Victorian city at sunset",
    "A magical forest with glowing mushrooms and ethereal light filtering through the trees",
  ];

  document.addEventListener("click", (e) => {
    if (e.target.closest(".placeholder") && !promptinput.value.trim()) {
      const randomprompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
      promptinput.value = randomprompt;
      promptinput.focus();
    }
  });

  // 🧠 Save the latest generation session
  function saveLastSession(prompt, count, resolution, style, quality, urls) {
    const data = { prompt, count, resolution, style, quality, urls };
    localStorage.setItem("lastGeneration", JSON.stringify(data));
  }

  // ♻️ Restore session if exists
  function restoreLastSession() {
    const saved = localStorage.getItem("lastGeneration");
    if (!saved) return;
    const { prompt, count, resolution, style, quality, urls } = JSON.parse(saved);

    promptinput.value = prompt;
    countselect.value = count;
    resolutionselect.value = resolution;
    styleselect.value = style;
    qualityselect.value = quality;

    if (urls && urls.length > 0) {
      const imagegrid = document.createElement("div");
      imagegrid.className = "image-grid";

      urls.forEach((imageUrl) => {
        const imagecard = document.createElement("div");
        imagecard.className = "image-card";
        imagecard.innerHTML = `
          <div class="image-container">
            <img src="${imageUrl}" alt="Generated image"
              style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px 8px 0 0;" />
          </div>
          <div class="image-info">
            <div class="image-prompt">${prompt}</div>
            <div class="image-details">
              <span>Resolution: ${resolution}</span>
              <span>Style: ${style}</span>
              <span>Quality: ${quality}</span>
            </div>
            <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem">
              <button onclick="downloadimage('${imageUrl}', '${prompt.substring(0, 30)}')"
                style="flex: 1; padding: 0.5rem; background-color: #30a4ec; color: white; border: none;
                border-radius: 4px; cursor: pointer;">Download</button>
              <button onclick="openimagemodal('${imageUrl}', '${prompt.substring(0, 30)}')"
                style="flex: 1; padding: 0.5rem; background-color: #333; color: white; border: none;
                border-radius: 4px; cursor: pointer;">View Full</button>
            </div>
          </div>
        `;
        imagegrid.appendChild(imagecard);
      });

      resultsdiv.appendChild(imagegrid);
      showstatusmessage("info", "Restored your last generated images.");
    }
  }

  // ⬇️ Download image
  window.downloadimage = function (imageUrl, filename) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-generated-${filename.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔍 Open full image modal
  window.openimagemodal = function (imageUrl, prompt) {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.9); display: flex;
      align-items: center; justify-content: center; z-index: 1000; cursor: pointer;
    `;
    modal.innerHTML = `
      <div style="max-width: 90%; max-height: 90%; position: relative">
        <img src="${imageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;" alt=""/>
        <div style="position: absolute; top: 40px; left: 0; right: 0; text-align: center; color: white; font-size: 0.9rem;">"${prompt}"</div>
        <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: -40px; right: 0; background-color: #ff4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
      </div>`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
  };
});
