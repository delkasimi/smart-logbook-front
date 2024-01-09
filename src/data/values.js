const possibleValues = {
    evenement: ["PC/preparation courante", "VAR/visite arrivée", "En vehicle(traction)"],
    personnel: ["John Doe", "Jane Smith", "Alice Johnson", "Robert Anderson", "Eva Martinez", "Michael Davis", "Sophia Wilson", "Daniel Taylor", "Olivia Brown"],
    train: [12345, 67890, 54321, 98765, 13579, 24680, 11223, 33445, 55667],
    // You can set possible values for date and time dynamically based on your requirements
    // For example, you can generate random dates and times within a specific range
    date: ["10/07/2023", "10/08/2023", "10/09/2023", "10/10/2023", "10/11/2023"],
    time: ["08:30", "10:45", "12:15", "14:30", "09:00", "11:45", "15:15", "10:30"],
    kms: [150, 200, 180, 250, 120, 180, 220, 150],
    hours: [2, 3, 4, 5],
    moteur: ["<MINI[", "<MINI-25[", "<25-50[", "<50-75[", "<75-MAXI[", ">MAXI["],
    hydrostatique: ["<MINI[", "<MINI-25[", "<25-50[", "<50-75[", "<75-MAXI[", ">MAXI["],
    compresseur: ["<MINI[", "<MINI-25[", "<25-50[", "<50-75[", "<75-MAXI[", ">MAXI["],
    boite: ["<MINI[", "<MINI-25[", "<25-50[", "<50-75[", "<75-MAXI[", ">MAXI["],
    moteurRefroidissement: ["<MINI[", "<MINI-25[", "<25-50[", "<50-75[", "<75-MAXI[", ">MAXI["],
    convertisseurRefroidissement: ["<MINI[", "<MINI-25[", "<25-50[", "<50-75[", "<75-MAXI[", ">MAXI["],
    carburant: ["Full", "Half", "Empty"],
    sable: ["<MINI[", "<MINI-25[", "<25-50[", "<50-75[", "<75-MAXI[", ">MAXI["],
    agres: ["Bon", "Mauvais"],
    manque: ["MINI", "MINI-25"], // Add more options as needed
    perime: ["T", "2T"], // Add more options as needed
  };
  
  export default possibleValues;
  