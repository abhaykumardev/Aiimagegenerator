const imagecard = `<div class="image-container" style="position: relative; overflow: hidden">
      <img
        src="${imageurl}"
        alt="Generated image"
        style="
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
          transition: transform 0.3s ease;
        "
        onload="this.style.opacity='1'"
        onerror="this.parentElement.innerHTML=``"
        loading="lazy"
      />

      <div
        class="image-overlay"
        style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          opacity: 0;
          display: flex;
          transition: 0.3s ease;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 1rem;
        "
      >
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
        <button
          onclick="downloadimage('${imageurl}', '${prompt.substring(0, 30)}')"
          style="
            flex: 1;
            padding: 0.5rem;
            background-color: #30a4ec;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
          "
        >
          Download
        </button>

        <button
          onclick="openimagemodel('${imageurl}', '${prompt.substring(0, 30)}')"
          style="
            flex: 1;
            padding: 0.5rem;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
          "
        >
          View Full
        </button>
      </div>
    </div>`;
