/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Mock citation data for testing
 */

/**
 * Mock citation data for testing
 */
const mockCitations = [
  {
    title: "Effects of Exercise on Cardiovascular Health in Patients with Type 2 Diabetes",
    authors: "Smith J, Johnson A, Williams B",
    year: "2022",
    journal: "Journal of Diabetes Research",
    abstract: "Background: Regular physical activity is recommended for patients with type 2 diabetes to improve cardiovascular health, but the optimal exercise regimen remains unclear. Methods: We conducted a randomized controlled trial with 120 patients with type 2 diabetes, comparing high-intensity interval training (HIIT) with moderate-intensity continuous training (MICT) over 12 weeks. Results: Both HIIT and MICT improved cardiovascular parameters, but HIIT showed greater improvements in VO2max and insulin sensitivity. Conclusion: HIIT may be more effective than MICT for improving cardiovascular health in patients with type 2 diabetes.",
    itemType: "journalArticle",
    tags: ["diabetes", "exercise", "cardiovascular health"],
    id: "item1"
  },
  {
    title: "Comparative Effectiveness of Aerobic and Resistance Exercise in Type 2 Diabetes Management",
    authors: "Brown R, Davis C, Miller E",
    year: "2021",
    journal: "Diabetes Care",
    abstract: "Objective: To compare the effectiveness of aerobic exercise versus resistance training in managing type 2 diabetes. Research Design and Methods: 150 adults with type 2 diabetes were randomly assigned to aerobic exercise, resistance training, or a combination of both for 24 weeks. Results: All exercise groups showed improvements in glycemic control, but the combined exercise group demonstrated the greatest reductions in HbA1c. Conclusions: A combination of aerobic and resistance exercise may be optimal for glycemic control in type 2 diabetes.",
    itemType: "journalArticle",
    tags: ["diabetes", "exercise", "glycemic control"],
    id: "item2"
  },
  {
    title: "Long-term Effects of Different Exercise Modalities on Cardiovascular Risk in Type 2 Diabetes",
    authors: "Garcia M, Rodriguez P, Hernandez L",
    year: "2023",
    journal: "European Journal of Preventive Cardiology",
    abstract: "Background: The long-term cardiovascular benefits of different exercise modalities in type 2 diabetes remain uncertain. Methods: We followed 200 patients with type 2 diabetes for 3 years who were assigned to different exercise programs. Results: Patients who maintained regular exercise showed significant reductions in cardiovascular events compared to sedentary controls, with combined aerobic and resistance training showing the greatest benefit. Conclusion: Long-term adherence to combined exercise training provides substantial cardiovascular protection in type 2 diabetes.",
    itemType: "journalArticle",
    tags: ["diabetes", "exercise", "cardiovascular risk", "long-term"],
    id: "item3"
  }
];

/**
 * Mock PICO elements for testing
 */
const mockPicoElements = {
  item1: {
    population: "Patients with type 2 diabetes",
    intervention: "High-intensity interval training (HIIT)",
    comparison: "Moderate-intensity continuous training (MICT)",
    outcome: "Cardiovascular health parameters, VO2max, insulin sensitivity"
  },
  item2: {
    population: "Adults with type 2 diabetes",
    intervention: "Aerobic exercise, resistance training, or combined exercise",
    comparison: "Between exercise modalities",
    outcome: "Glycemic control, HbA1c levels"
  },
  item3: {
    population: "Patients with type 2 diabetes",
    intervention: "Different exercise programs including combined aerobic and resistance training",
    comparison: "Sedentary controls",
    outcome: "Cardiovascular events, long-term cardiovascular protection"
  }
};

module.exports = {
  mockCitations,
  mockPicoElements
};
