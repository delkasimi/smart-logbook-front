import json
import random

def generate_data():
    systems = {
        
    "10.Air": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ],
    "20 Frein": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ],
    "30. Moteur": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ],
    "40. Electrique": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ],
    "50. Securite": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ],
    "60.Bougie": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ],
    "70.Caisses": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ],
    "80. Cabine": [
        "05. Equipement Basse Tension",
        "10. Systeme de Commande",
        "15. Contrôle Associé",
        "20. Machines Tournantes Auxiliaires",
        "25. Generation Auxiliaire / Batterie",
        "30. Diagnostic Embarque",
        "40. Pantographie",
        "45. Radio commande",
        "50. Manipulateur de Traction / Freinage",
        "55. Organes et Commande de couplabilite",
        "60. Fanal",
        "65. Anti patinage"
    ]
}
    issue_types = {
        "MEASURE": [
            "MSR01 - Alarme", "MSR02 - Parametre anormal", "MSR03 - Parametre instable", "MSR04 - Parametre trop eleve",
            "MSR05 - Parametre trop bas", "MSR06 - Parametre absent"
        ],
        "OBSERVATION": [
            "OBS01 - Vibration ou bruit", "OBS02 - Fuite", "OBS03 - Blocage", "OBS04 - Glissement",
            "OBS05 - Temperature", "OBS06 - Vitesse", "OBS07 - Non conforme", "OBS09 - Perte d'energie",
            "OBS10 - Deficience structurelle"
        ],
        "COMMANDE": [
            "CDE01 - Ne demarre pas", "CDE02 - Ne s'arrete pas", "CDE03 - Ne s'ouvre pas",
            "CDE04 - Ne se ferme pas", "CDE05 - Ne se connecte pas", "CDE06 - Ne se deconnecte pas",
            "CDE07 - Ne tourne pas", "CDE08 - S'arrete"
        ]
    }
    code_objects = ["BATTE", "CHARG", "GENEA", "PANDA"]
    statuses = ["RECORDED", "SOLVED", "OPEN", "PLANNED", "PLANNED/SOLVED", "CLOSED 1ST LEVEL", "CLOSED"]

    data_samples = []
    for i in range(1, 201):
        system = random.choice(list(systems.keys()))
        sub_system = random.choice(systems[system])
        issue_type = random.choice(list(issue_types.keys()))
        issue = random.choice(issue_types[issue_type])
        code_objet = random.choice(code_objects)
        status = random.choice(statuses)

        data_samples.append({
            "fleet": random.choice(["Euro4000", "G1000"]),
            "mainAsset": random.choice([4010, 4015, 4020]),
            "date": "01/01/2023",
            "system": system,
            "subSystem": sub_system,
            "codeObjet": code_objet,
            "name": code_objet.lower(),
            "issueType": issue_type,
            "issue": issue,
            "comment": "Example Comment",
            "media": "Example Media",
            "status": status
        })

    return data_samples

# Generate the data
generated_data = generate_data()

# Writing the data to a JSON file
with open('generated_data.json', 'w') as file:
    json.dump(generated_data, file, indent=4)

print("Data has been written to 'generated_data.json'")
