// ---------------------------------------------------------------------------
// SUBJECT HIERARCHY — metadata only, no questions
// Used for UI filtering (Game Arena selection) and Firebase querying.
// Actual MCQ questions live in Firebase (imported via CSV).
// ---------------------------------------------------------------------------

export type Domain     = "iti" | "diploma" | "btech";
export type Difficulty = "easy" | "medium" | "hard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SubjectCategory {
  name: string;
  subjects: string[];
}

export interface AddonGroup {
  label: string;
  subjects: string[];
}

export interface DomainHierarchy {
  domain: Domain;
  label: string;
  categories: SubjectCategory[];
  addonGroups?: AddonGroup[];
}

// ---------------------------------------------------------------------------
// HIERARCHY
// ---------------------------------------------------------------------------
export const SUBJECT_HIERARCHY: DomainHierarchy[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ITI
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domain: "iti",
    label: "ITI",
    categories: [
      {
        name: "Drawing & Design",
        subjects: [
          "Engineering Drawing & CAD",
          "Machine Drawing Elements",
          "Limits, Fit & Tolerance",
        ],
      },
      {
        name: "Building & Materials",
        subjects: [
          "Building Materials",
          "Building Construction",
          "Building Planning & Estimation",
        ],
      },
      {
        name: "Surveying",
        subjects: [
          "Basic Surveying",
          "Advanced Surveying",
        ],
      },
      {
        name: "Structures & Mechanics",
        subjects: [
          "RCC & Steel Structures",
          "Mechanics & Mensuration",
        ],
      },
      {
        name: "Water & Transportation",
        subjects: [
          "Hydraulics & Irrigation",
          "Transportation Engineering",
          "Public Health & Sanitation",
        ],
      },
    ],
    addonGroups: [
      {
        label: "Junior Instructor / Training Instructor",
        subjects: [
          "Advanced Engineering Mechanics",
          "Tunnel Engineering",
          "Building Planning Principles",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIPLOMA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domain: "diploma",
    label: "Diploma",
    categories: [
      {
        name: "Drawing & Design",
        subjects: [
          "Engineering Drawing & CAD",
          "Machine Drawing Elements",
          "Limits, Fit & Tolerance",
        ],
      },
      {
        name: "Building & Materials",
        subjects: [
          "Building Materials",
          "Construction Technology",
          "Building Planning & Byelaws",
        ],
      },
      {
        name: "Surveying",
        subjects: [
          "Surveying",
        ],
      },
      {
        name: "Structures & Mechanics",
        subjects: [
          "Engineering Mechanics",
          "Structural Engineering",
        ],
      },
      {
        name: "Geotechnical & Foundation",
        subjects: [
          "Geotechnical & Foundation Engineering",
        ],
      },
      {
        name: "Water & Environment",
        subjects: [
          "Water Resources & Hydraulics",
          "Environmental Engineering",
        ],
      },
      {
        name: "Transportation & Estimation",
        subjects: [
          "Transportation Engineering",
          "Estimation & Costing",
        ],
      },
    ],
    addonGroups: [
      {
        label: "Overseer Civil / Site Engineer",
        subjects: [
          "Theory of Structures",
          "Geotechnical Engineering",
          "Foundation Engineering",
          "Advanced Environmental Engineering",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BTECH
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domain: "btech",
    label: "B.Tech",
    categories: [
      {
        name: "Structural Engineering",
        subjects: [
          "Structural Analysis",
          "Structural Design",
          "Engineering Mechanics & Solid Mechanics",
        ],
      },
      {
        name: "Geotechnical Engineering",
        subjects: [
          "Geotechnical Engineering",
        ],
      },
      {
        name: "Water & Hydraulics",
        subjects: [
          "Fluid Mechanics & Hydraulics",
          "Water Resources Engineering",
        ],
      },
      {
        name: "Environmental Engineering",
        subjects: [
          "Environmental Engineering",
        ],
      },
      {
        name: "Surveying & Planning",
        subjects: [
          "Surveying & Geomatics",
          "Urban Planning",
        ],
      },
      {
        name: "Construction & Estimation",
        subjects: [
          "Estimation, Costing & Valuation",
          "Construction Engineering & Management",
        ],
      },
      {
        name: "Transportation & Mathematics",
        subjects: [
          "Transportation Engineering",
          "Technical Mathematics",
        ],
      },
    ],
    addonGroups: [
      {
        label: "AE – Pollution Control Board",
        subjects: [
          "Air Pollution Control & Dispersion Modelling",
          "Noise & Industrial Pollution Control",
          "Solid & Hazardous Waste Management",
          "Environmental Law & Regulations",
          "Engineering Mathematics (AE PCB)",
        ],
      },
      {
        label: "AE – Kerala Water Authority",
        subjects: [
          "Advanced Water Supply Engineering",
          "Advanced Wastewater Treatment & Reuse",
          "Urban & Regional Planning",
          "Basic Mechanical Engineering",
          "Basic Chemical Engineering",
        ],
      },
      {
        label: "Lecturer Civil Engineering – Polytechnics",
        subjects: [
          "Engineering Mathematics (Poly Lecturer)",
          "Basic Electrical Engineering",
          "Basic Electronics Engineering",
          "Construction Management (Advanced)",
        ],
      },
      {
        label: "Assistant Professor Civil Engineering",
        subjects: [
          "Engineering Mathematics (Asst. Professor)",
          "Plastic Analysis & Matrix Methods",
          "Structural Dynamics",
          "GIS & Geoinformatics",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// DIFFICULTY COUNTS — how many questions per difficulty in a game session
// ---------------------------------------------------------------------------
export const DIFFICULTY_COUNTS: Record<Difficulty, number> = {
  easy:   25,
  medium: 50,
  hard:   25,
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/** Get a single domain's hierarchy entry */
export function getDomainHierarchy(domain: Domain): DomainHierarchy | undefined {
  return SUBJECT_HIERARCHY.find((d) => d.domain === domain);
}

/** Get flat list of core subjects for a domain (excludes addons) */
export function getSubjects(domain: Domain): string[] {
  const entry = getDomainHierarchy(domain);
  if (!entry) return [];
  return entry.categories.flatMap((c) => c.subjects);
}

/** Get flat list of addon subjects for a domain */
export function getAddonSubjects(domain: Domain): string[] {
  const entry = getDomainHierarchy(domain);
  if (!entry?.addonGroups) return [];
  return entry.addonGroups.flatMap((g) => g.subjects);
}

/** Get all subjects (core + addon) for a domain */
export function getAllSubjects(domain: Domain): string[] {
  return [...getSubjects(domain), ...getAddonSubjects(domain)];
}

/** Get addon groups for a domain (for UI labelling) */
export function getAddonGroups(domain: Domain): AddonGroup[] {
  return getDomainHierarchy(domain)?.addonGroups ?? [];
}

// ---------------------------------------------------------------------------
// Legacy compatibility — flat maps matching old SUBJECTS_BY_DOMAIN shape
// ---------------------------------------------------------------------------
export const SUBJECTS_BY_DOMAIN: Record<Domain, string[]> = {
  iti:     getSubjects("iti"),
  diploma: getSubjects("diploma"),
  btech:   getSubjects("btech"),
};

export const ADDON_SUBJECTS: Record<Domain, string[]> = {
  iti:     getAddonSubjects("iti"),
  diploma: getAddonSubjects("diploma"),
  btech:   getAddonSubjects("btech"),
};

export const ADDON_GROUPS: Partial<Record<Domain, AddonGroup[]>> = {
  iti:     getAddonGroups("iti"),
  diploma: getAddonGroups("diploma"),
  btech:   getAddonGroups("btech"),
};
