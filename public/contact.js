const form = document.querySelector("[data-mailto-form]");
const status = document.querySelector("[data-form-status]");

// Pre-select the Project type from a ?type= link (e.g. contact.html?type=venue).
(function presetProjectType() {
  const projectTypeSelect = document.getElementById("project-type");
  if (!projectTypeSelect) return;

  const presets = {
    venue: "Venue or event",
    property: "Real estate or facility",
    museum: "Museum or heritage site",
    jobsite: "Construction or job site",
    other: "Other environment",
  };
  const preset = new URLSearchParams(location.search).get("type");
  const value = presets[preset || ""];

  if (value && Array.from(projectTypeSelect.options).some((o) => o.value === value)) {
    projectTypeSelect.value = value;
  }
})();

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const name = data.get("name").trim();
    const projectType = data.get("projectType").trim();
    const subject = `3D scanning inquiry: ${projectType} from ${name}`;
    const fields = [
      ["Name", name],
      ["Email", data.get("email")],
      ["Organization", data.get("organization")],
      ["Phone", data.get("phone")],
      ["Project type", projectType],
      ["Location", data.get("location")],
      ["Target timeline", data.get("timeline")],
      ["Project goals", data.get("message")],
    ];
    const body = fields
      .filter(([, value]) => value && value.trim())
      .map(([label, value]) => `${label}:\n${value.trim()}`)
      .join("\n\n");
    const mailto = `mailto:hello@irlscanning.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.textContent = "Your email application should open with a prepared draft. Review it and press Send to deliver your inquiry.";
    window.location.href = mailto;
  });
}
