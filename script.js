const INSTAGRAM_HANDLE = "@swifasia";
const CHANGE_EVERY_MS = 10000;

const poses = [
  { src: "assets/swifi-heart.png", alt: "SWIFI membentuk hati", caption: "Kirim hati untuk SWIFI!" },
  { src: "assets/swifi-peace.png", alt: "SWIFI berpose peace", caption: "Pose peace dulu!" },
  { src: "assets/swifi-thumbsup.png", alt: "SWIFI memberi jempol", caption: "Mantap! Siap foto?" },
  { src: "assets/swifi-excited.png", alt: "SWIFI terlihat antusias", caption: "Tunjukkan semangatmu!" },
  { src: "assets/swifi-greeting.png", alt: "SWIFI menyapa pengunjung", caption: "Senyum terbaik, ya!" }
];

const imageA = document.getElementById("poseA");
const imageB = document.getElementById("poseB");
const caption = document.getElementById("poseCaption");
const count = document.getElementById("slideCount");
const progress = document.getElementById("progressBar");
document.getElementById("instagramHandle").textContent = INSTAGRAM_HANDLE;

let index = 0;
let showingA = true;
let startedAt = performance.now();

function showPose(nextIndex) {
  index = nextIndex % poses.length;
  const incoming = showingA ? imageB : imageA;
  const outgoing = showingA ? imageA : imageB;
  incoming.src = poses[index].src;
  incoming.alt = poses[index].alt;
  incoming.classList.add("active");
  outgoing.classList.remove("active");
  caption.textContent = poses[index].caption;
  count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(poses.length).padStart(2, "0")}`;
  showingA = !showingA;
  startedAt = performance.now();
}

function animate(now) {
  const elapsed = now - startedAt;
  progress.style.width = `${Math.min(100, (elapsed / CHANGE_EVERY_MS) * 100)}%`;
  if (elapsed >= CHANGE_EVERY_MS) showPose(index + 1);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

/* ---------------------------------------------------------------------
   KEMBALI KE TOTEM
   Tombol hanya muncul bila halaman dibuka dari totem SWIF ASIA
   (link berakhiran ?from=totem). Tombol menutup tab ini sehingga tab
   totem tampil kembali. Tanpa sentuhan selama AUTO_RETURN_MS, tab
   kembali ke totem secara otomatis.
   --------------------------------------------------------------------- */
const AUTO_RETURN_MS = 180000; // 3 menit

(function setupBackToTotem() {
  const params = new URLSearchParams(location.search);
  if (params.get("from") !== "totem") return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-to-totem";
  btn.setAttribute("aria-label", "Kembali ke totem");
  btn.innerHTML = '<span class="btt-arrow" aria-hidden="true">&#8592;</span><span class="btt-label">KEMBALI<br>KE TOTEM</span>';
  document.body.appendChild(btn);

  function backToTotem() {
    // Tab ini dibuka oleh totem lewat window.open, jadi boleh ditutup oleh skrip.
    window.close();
    // Bila browser menolak menutup tab, kembali ke halaman sebelumnya.
    setTimeout(() => {
      if (document.referrer) location.href = document.referrer;
      else history.back();
    }, 400);
  }

  btn.addEventListener("click", backToTotem);

  let idleTimer = setTimeout(backToTotem, AUTO_RETURN_MS);
  ["pointerdown", "keydown"].forEach((evt) =>
    window.addEventListener(evt, () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(backToTotem, AUTO_RETURN_MS);
    }, { passive: true })
  );
})();
