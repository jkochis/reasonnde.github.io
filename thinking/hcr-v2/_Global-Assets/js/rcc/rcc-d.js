/*
  +++ Global Data File +++
  Is included in the HTML before the main app files.
  Configure all the user-facing data here, which will then be assigned to global variables,
  so that it is available to the app.
  TODO Separate config file was client request. Move contents to regular require file if build process allows.
 */
(function() {
  define(function() {
    var aflacInsurancesData, diseaseData, familyData, incomeData, insuranceData, rentData;
    diseaseData = [
      {
        "name": "Heart Attack",
        "id": "heart-attack",
        "order": {
          "male": 1,
          "female": 5
        },
        "severities": {
          "mild": {
            "medical": 25805,
            "oop": 3871,
            "duration": 0.5,
            "medicalText": "Requires aspirin or nitroglycerin among other medicine for pain management."
          },
          "moderate": {
            "medical": 38707,
            "oop": 7741,
            "duration": 1.5,
            "medicalText": "Emergency treatment is necessary and may also require surgery."
          },
          "severe": {
            "medical": 51609,
            "oop": 11612,
            "duration": 3,
            "medicalText": "Requires emergency medical treatment and may involve invasive surgery."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. "
        },
        "desc": {
          "female": ["Under age 50, women�s heart attacks are twice as likely as men�s to be fatal.",
		  "Under age 50, women�s heart attacks are twice as likely as men�s to be fatal.",
		  "Under age 50, women�s heart attacks are twice as likely as men�s to be fatal.",
		  "Under age 50, women�s heart attacks are twice as likely as men�s to be fatal.",
		  "Under age 50, women�s heart attacks are twice as likely as men�s to be fatal.",
		  "Under age 50, women�s heart attacks are twice as likely as men�s to be fatal.",
		  "For women aged 51-55, Heart Disease is the number one killer.",
		  "For women ages 56-60, heart disease is the number one killer.",
		  "For women ages 61-65, heart disease is the number one killer.",
		  "For women ages 66-70, heart disease is the number one killer.",
		  "For women ages 71-75, heart disease is the number one killer.",
		  "For women ages 76-80, heart disease is the number one killer.", 
		  "For women ages 81-85, heart disease is the number one killer.",
		  "For women ages 86-90, heart disease is the number one killer."],
          "male": ["Men ages 20-25 have a greater and earlier risk of heart attack than women do.",
		  "Men ages 26-30 have a greater and earlier risk of heart attack than women do.",
		  "Men ages 31-35 have a greater and earlier risk of heart attack than women do.",
		  "Men ages 36-40 have a greater and earlier risk of heart attack than women do.",
		  "Men ages 41-45 have a greater and earlier risk of heart attack than women do.",
		  "Men ages 46-50 have a greater risk of heart attack than women do.",
		  "Men ages 51-55 have a greater risk of heart attack than women do.",
		  "Men ages 56-60 have a greater of heart attack than women do. ",
		  "Men ages 61-65 have a greater risk of heart attack than women do.",
		  "Men ages 66-70 have a greater risk of heart attack than women do.",
		  "Men ages 71-75 have a greater risk of heart attack than women do.",
		  "Men ages 76-80 have a greater risk of heart attack than women do.",
		  "Men ages 81-85 have a greater risk of heart attack than women do.",
		  "Men ages 86-90 have a greater risk of heart attack than women do."]
        },
        "groupPolicies": [
          {
            aflacInsurance: "criticalillness",
            mild: 101,
            moderate: 12573,
            severe: 119493
          }, {
            aflacInsurance: "hospital",
            mild: 151,
            moderate: 3114,
            severe: 23287
          }, {
            aflacInsurance: "disability",
            mild: 135,
            moderate: 5512,
            severe: 44143
          }
        ],
        "individualPolicies": [
          {
            aflacInsurance: "criticalillness",
            mild: 5800,
            moderate: 8276,
            severe: 10717
          }, {
            aflacInsurance: "hospital",
            mild: 400,
            moderate: 1712,
            severe: 2700
          }, {
            aflacInsurance: "short-term-disability",
            mild: 583,
            moderate: 3193,
            severe: 4200
          }
        ]
      }, {
        "name": "Broken Leg",
        "id": "broken-leg",
        "order": {
          "male": 2,
          "female": 2
        },
        "severities": {
          "mild": {
            "medical": 2269,
            "oop": 340,
            "duration": 0.25,
            "medicalText": "A hairline fracture that may or may not require a cast. "
          },
          "moderate": {
            "medical": 3403,
            "oop": 681,
            "duration": 0.5,
            "medicalText": "Fracture with possible misalignment requires closed reduction and immobilization."
          },
          "severe": {
            "medical": 4537,
            "oop": 1021,
            "duration": 1,
            "medicalText": "An injury that requires surgical reduction with hardware, plus medication and hospitalization."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication and physical therapy costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. Additional costs could include traveling to work and being unable to walk, taking public transit, etc."
        },
        "desc": {
          "female": ["For a 20- to 25-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 26- to 30-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 31- to 35-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 36- to 40-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 41- to 45-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 46- to 50-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 51- to 55-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 56- to 60-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 61- to 65-year-old woman, a wrist fracture is the most common type of fracture.",
		  "For a 66- to 70-year-old woman, a wrist fracture is the most common type of fracture.",
		  "Hips are the most commonly broken bone over age 75.",
		  "Hips are the most commonly broken bone over age 75.",
		  "Hips are the most commonly broken bone over age 75.",
		  "Hips are the most commonly broken bone over age 75."],
          "male": ["Extremity fractures most commonly occur in men younger than age 45.",
		  "Extremity fractures most commonly occur in men younger than age 45.",
		  "Extremity fractures most commonly occur in men younger than age 45.",
		  "Extremity fractures most commonly occur in men younger than age 45.",
		  "Extremity fractures most commonly occur in men younger than age 45.",
		  "For a 46- to 50-year-old man, an arm or leg fracture is the most common type.",
		  "For a 51- to 55-year-old man, an arm or leg fracture is the most common type.",
		  "For a 56- to 60-year-old man, an arm or leg fracture is the most common type.",
		  "For a 61- to 65-year-old man, an arm or leg fracture is the most common type.", 
		  "For a 66- to 70-year-old man, an arm or leg fracture is the most common type.",
		  "Hip fractures are the most common type over age 75.",
		  "Hip fractures are the most common type over age 75.", 
		  "Hip fractures are the most common type over age 75.",
		  "Hip fractures are the most common type over age 75."]
        },
        "groupPolicies": [
          {
            aflacInsurance: "accident",
            mild: 173,
            moderate: 3367,
            severe: 18975
          }, {
            aflacInsurance: "hospital",
            mild: 100,
            moderate: 435,
            severe: 1323
          }, {
            aflacInsurance: "disability",
            mild: 126,
            moderate: 4447,
            severe: 13467
          }
        ],
        "individualPolicies": [
          {
            aflacInsurance: "accident",
            mild: 770,
            moderate: 2640,
            severe: 3865
          }, {
            aflacInsurance: "hospital",
            mild: 400,
            moderate: 1706,
            severe: 2450
          }, {
            aflacInsurance: "short-term-disability",
            mild: 1097,
            moderate: 3744,
            severe: 5379
          }
        ]
      }, {
        "name": "Colorectal Cancer",
        "id": "colorectal-cancer",
        "order": {
          "male": 3,
          "female": 11
        },
        "severities": {
          "mild": {
            "medical": 34541,
            "oop": 5181,
            "duration": 0.5,
            "medicalText": "Treatment may include local surgery or only observation."
          },
          "moderate": {
            "medical": 51812,
            "oop": 10362,
            "duration": 2,
            "medicalText": "Requires chemotherapy and surgery to remove parts of the colon and lymph nodes."
          },
          "severe": {
            "medical": 69083,
            "oop": 15544,
            "duration": 3,
            "medicalText": "Advanced stage that's treated with chemotherapy."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. Traveling to a cancer center might entail travel/lodging, parking and food. "
        },
        "desc": {
          "female": ["As a 20- to 25-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.", 
		  "As a 26- to 30-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.",
		  "As a 31- to 35-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.",
		  "As a 36- to 40-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.",
		  "As a 41- to 45-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.", 
		  "As a 46- to 50-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.",
		  "As a 51- to 55-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.", 
		  "As a 56- to 60-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.",
		  "As a 61- to 65-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.",
		  "As a 66- to 70-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.", 
		  "As a 71- to 75-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.", 
		  "As a 76- to 80-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20.", 
		  "As an 81- to 85-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20. ", 
		  "As an 86- to 90-year-old woman, your lifetime risk of developing colorectal cancer is about 1 in 20."],
          "male": ["Men ages 20-25 have a higher lifetime risk of developing colorectal cancer than women.",
		  "Men ages 26-30 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 31-35 have a higher lifetime risk of developing colorectal cancer than women.",
		  "Men ages 36-40 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 41-45 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 46-50 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 51-55 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 56-60 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 61-65 have a higher lifetime risk of developing colorectal cancer than women.",
		  "Men ages 66-70 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 71-75 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 76-80 have a higher lifetime risk of developing colorectal cancer than women.", 
		  "Men ages 81-85 have a higher lifetime risk of developing colorectal cancer than women.",
		  "Men ages 86-90 have a higher lifetime risk of developing colorectal cancer than women."]
        },
        groupPolicies: [
          {
            aflacInsurance: "criticalillness",
            mild: 223,
            moderate: 14537,
            severe: 68464
          }, {
            aflacInsurance: "hospital",
            mild: 148,
            moderate: 4101,
            severe: 66976
          }, {
            aflacInsurance: "disability",
            mild: 233,
            moderate: 7526,
            severe: 42109
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "cancer",
            mild: 1687,
            moderate: 10004,
            severe: 15275
          }, {
            aflacInsurance: "hospital",
            mild: 500,
            moderate: 2111,
            severe: 3200
          }, {
            aflacInsurance: "short-term-disability",
            mild: 1267,
            moderate: 5032,
            severe: 7325
          }
        ]
      }, {
        "name": "Lung Cancer",
        "id": "lung-cancer",
        "order": {
          "male": 4,
          "female": 4
        },
        "severities": {
          "mild": {
            "medical": 40590,
            "oop": 6089,
            "duration": 0.5,
            "medicalText": "Requires surgery to remove tissue, with possible chemotherapy or radiation."
          },
          "moderate": {
            "medical": 60885,
            "oop": 12177,
            "duration": 2,
            "medicalText": "Large tumors are treated with combination of surgery, chemotherapy and radiation. "
          },
          "severe": {
            "medical": 81180,
            "oop": 18266,
            "duration": 4,
            "medicalText": "Advanced stage that's treated with surgery, chemotherapy and radiation."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. Traveling to a cancer center might entail travel/lodging, parking and food. "
        },
        "desc": {
          "female": ["Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "Lung cancer is the second leading cause of cancer death in women (not counting skin cancer).", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ",
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older."],
          "male": ["As a 20- to 25-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 26- to 30-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 31- to 35-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 36- to 40-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 41- to 45-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 46- to 50-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 51- to 55-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 56- to 60-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "As a 61- to 65-year-old man, you have a 1 in 13 risk of developing lung cancer in your lifetime.", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older. ", 
		  "About 2 out of 3 people diagnosed with lung cancer are 65 or older."]
        },
        groupPolicies: [
          {
            aflacInsurance: "criticalillness",
            mild: 140,
            moderate: 8082,
            severe: 30377
          }, {
            aflacInsurance: "hospital",
            mild: 301,
            moderate: 1504,
            severe: 5295
          }, {
            aflacInsurance: "disability",
            mild: 2310,
            moderate: 10082,
            severe: 26606
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "cancer",
            mild: 1890,
            moderate: 9865,
            severe: 15800
          }, {
            aflacInsurance: "hospital",
            mild: 550,
            moderate: 2117,
            severe: 3155
          }, {
            aflacInsurance: "short-term-disability",
            mild: 1813,
            moderate: 5660,
            severe: 8400
          }
        ]
      }, {
        "name": "Diabetes",
        "id": "diabetes",
        "order": {
          "male": 5,
          "female": 6
        },
        "severities": {
          "mild": {
            "medical": 7313,
            "oop": 1097,
            "duration": 0.25,
            "medicalText": "A mild elevation of blood glucose and enzymes is treated with diet and exercise. "
          },
          "moderate": {
            "medical": 10970,
            "oop": 2194,
            "duration": 0.5,
            "medicalText": "Medication, exercise and weight loss are required to lower blood sugars."
          },
          "severe": {
            "medical": 14627,
            "oop": 3291,
            "duration": 0.5,
            "medicalText": "Requires insulin and possible insulin pumps along with strict dietary guidelines."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. Additionally, there are costs for glucose monitoring equipment and dietary-nutrition support, such as cookbooks.  "
        },
        "desc": {
          "female": ["12.3% of all Americans 20 and older have diabetes.",
		  "12.3% of all Americans 20 and older have diabetes.", 
		  "12.3% of all Americans 20 and older have diabetes.",
		  "12.3% of all Americans 20 and older have diabetes.", 
		  "12.3% of all Americans 20 and older have diabetes.", 
		  "12.3% of all Americans 20 and older have diabetes.", 
		  "12.3% of all Americans 20 and older have diabetes.",
		  "12.3% of all Americans 20 and older have diabetes.",
		  "12.3% of all Americans 20 and older have diabetes.", 
		  "25.9% of Americans aged 65 and older have diabetes.",
		  "25.9% of Americans aged 65 and older have diabetes ", 
		  "25.9% of Americans aged 65 and older have diabetes.", 
		  "25.9% of Americans aged 65 and older have diabetes.",
		  "25.9% of Americans aged 65 and older have diabetes."],
          "male": ["13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "13.6% of American men have diabetes.", 
		  "25.9% of Americans aged 65 and older have diabetes.", 
		  "25.9% of Americans aged 65 and older have diabetes.", 
		  "25.9% of Americans aged 65 and older have diabetes.", 
		  "25.9% of Americans aged 65 and older have diabetes.", 
		  "25.9% of Americans aged 65 and older have diabetes."]
        },
        "groupPolicies": [
          {
            aflacInsurance: "hospital",
            mild: 100,
            moderate: 2026,
            severe: 35782
          }, {
            aflacInsurance: "disability",
            mild: 139,
            moderate: 6994,
            severe: 39286
          }
        ],
        "individualPolicies": [
          {
            aflacInsurance: "hospital",
            mild: 300,
            moderate: 1148,
            severe: 1500
          }, {
            aflacInsurance: "short-term-disability",
            mild: 347,
            moderate: 3647,
            severe: 4711
          }
        ]
      }, {
        "name": "Stroke",
        "id": "stroke",
        "order": {
          "male": 6,
          "female": 2
        },
        "severities": {
          "mild": {
            "medical": 66667,
            "oop": 10000,
            "duration": 0.5,
            "medicalText": "Symptoms are short-lived and investigative tests help determine cause."
          },
          "moderate": {
            "medical": 100000,
            "oop": 20000,
            "duration": 1.5,
            "medicalText": "Symptoms may resolve over time with medication and physical therapy."
          },
          "severe": {
            "medical": 133333,
            "oop": 30000,
            "duration": 3,
            "medicalText": "Requires anticoagulant medications and long-term physical therapy. "
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits and/or physical therapy."
        },
        "desc": {
          "female": ["More than half of total stroke deaths occur in women.", 
		  "More than half of total stroke deaths occur in women.", 
		  "More than half of total stroke deaths occur in women.",
		  "More than half of total stroke deaths occur in women.", 
		  "More than half of total stroke deaths occur in women.",
		  "More than half of total stroke deaths occur in women.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55.",
		  "Your chance of having a stroke doubles for each decade of life after age 55.",
		  "Your chance of having a stroke doubles for each decade of life after age 55.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55.",
		  "Your chance of having a stroke doubles for each decade of life after age 55.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55."],
          "male": ["Nearly a quarter of strokes occur in people younger than 65.", 
		  "Nearly a quarter of strokes occur in people younger than 65.",
		  "Nearly a quarter of strokes occur in people younger than 65.", 
		  "Nearly a quarter of strokes occur in people younger than 65.", 
		  "Nearly a quarter of strokes occur in people younger than 65.", 
		  "Nearly a quarter of strokes occur in people younger than 65.", 
		  "Nearly a quarter of strokes occur in people younger than 65.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55.",
		  "Your chance of having a stroke doubles for each decade of life after age 55.",
		  "Your chance of having a stroke doubles for each decade of life after age 55.",
		  "Your chance of having a stroke doubles for each decade of life after age 55.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55.", 
		  "Your chance of having a stroke doubles for each decade of life after age 55."]
        },
        "groupPolicies": [
          {
            aflacInsurance: "criticalillness",
            mild: 1000,
            moderate: 12505,
            severe: 107766
          }, {
            aflacInsurance: "hospital",
            mild: 110,
            moderate: 3420,
            severe: 31000
          }, {
            aflacInsurance: "disability",
            mild: 233,
            moderate: 7994,
            severe: 49835
          }
        ],
        "individualPolicies": [
          {
            aflacInsurance: "criticalillness",
            mild: 6000,
            moderate: 9824,
            severe: 12617
          }, {
            aflacInsurance: "hospital",
            mild: 600,
            moderate: 2337,
            severe: 3150
          }, {
            aflacInsurance: "short-term-disability",
            mild: 1027,
            moderate: 4987,
            severe: 6888
          }
        ]
      }, {
        "name": "Prostate Cancer",
        "id": "prostate-cancer",
        "female": false,
        "order": {
          "male": 7,
          "female": 99
        },
        "severities": {
          "mild": {
            "medical": 13140,
            "oop": 1971,
            "duration": 0.5,
            "medicalText": "Early stage cancer with biopsy-proven carcinoma that is confined to the gland. "
          },
          "moderate": {
            "medical": 19710,
            "oop": 3942,
            "duration": 1,
            "medicalText": "Aggressive tumors outside of the gland may or may not have spread."
          },
          "severe": {
            "medical": 26280,
            "oop": 5913,
            "duration": 2,
            "medicalText": "Requires chemotherapy and radiation treatments."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. Traveling to a cancer center might entail travel/lodging, parking and food. "
        },
        "desc": {
          "female": [],
          "male": ["For a man age 20-25, the chance of having prostate cancer is very rare. About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.", 
		  "For a man age 26-30, the chance of having prostate cancer is very rare. About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.",
		  "For a man age 31-35, the chance of having prostate cancer is very rare. About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.", 
		  "For a man age 36-40, the chance of having prostate cancer is very rare. About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.", 
		  "About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.", 
		  "About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.", 
		  "About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.",
		  "About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.", 
		  "About 6 cases of prostate cancer in 10 are diagnosed in men aged 65 or older.", 
		  "66 is the median age of diagnosis for prostate cancer.", 
		  "66 is the median age of diagnosis for prostate cancer.", 
		  "66 is the median age of diagnosis for prostate cancer.", 
		  "66 is the median age of diagnosis for prostate cancer.",
		  "66 is the median age of diagnosis for prostate cancer."]
        },
        groupPolicies: [
          {
            aflacInsurance: "criticalillness",
            mild: 101,
            moderate: 12449,
            severe: 80494
          }, {
            aflacInsurance: "hospital",
            mild: 130,
            moderate: 1827,
            severe: 7475
          }, {
            aflacInsurance: "disability",
            mild: 220,
            moderate: 3725,
            severe: 29151
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "cancer",
            mild: 1785,
            moderate: 7604,
            severe: 11330
          }, {
            aflacInsurance: "hospital",
            mild: 250,
            moderate: 1090,
            severe: 1550
          }, {
            aflacInsurance: "short-term-disability",
            mild: 887,
            moderate: 2937,
            severe: 3723
          }
        ]
      }, {
        "name": "Broken Leg (Child)",
        "id": "broken-leg-child",
        "order": {
          "male": 8,
          "female": 7
        },
        "severities": {
          "mild": {
            "medical": 3133,
            "oop": 470,
            "duration": 0.25,
            "medicalText": "An injury that may or may not require a cast. "
          },
          "moderate": {
            "medical": 4700,
            "oop": 940,
            "duration": 0.5,
            "medicalText": "Fracture with possible misalignment requires closed reduction and immobilization."
          },
          "severe": {
            "medical": 6267,
            "oop": 1410,
            "duration": 1,
            "medicalText": "Requires surgical reduction with hardware to repair, plus medication and hospitalization."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication and physical therapy costs for your child.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits and/or physical therapy. "
        },
        "desc": {
          "female": ["More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.",
		  "More than 200,000 children visit emergency rooms annually for playground injuries.",
		  "More than 200,000 children visit emergency rooms annually for playground injuries.",
		  "More than 200,000 children visit emergency rooms annually for playground injuries."],
          "male": ["More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.",
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.",
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.",
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries.", 
		  "More than 200,000 children visit emergency rooms annually for playground injuries."]
        },
        groupPolicies: [
          {
            aflacInsurance: "accident",
            mild: 100,
            moderate: 2928,
            severe: 14307
          }, {
            aflacInsurance: "hospital",
            mild: 100,
            moderate: 274,
            severe: 1232
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "accident",
            mild: 695,
            moderate: 1642,
            severe: 2270
          }, {
            aflacInsurance: "hospital",
            mild: 250,
            moderate: 1174,
            severe: 1600
          }
        ]
      }, {
        "name": "Asthma (Child)",
        "id": "asthma-child",
        "order": {
          "male": 9,
          "female": 8
        },
        "severities": {
          "mild": {
            "medical": 693,
            "oop": 104,
            "duration": 0.25,
            "medicalText": "Use of inhalers less than 2 times a week. "
          },
          "moderate": {
            "medical": 1039,
            "oop": 208,
            "duration": 0.5,
            "medicalText": "Requires daily medication like inhalers used episodically."
          },
          "severe": {
            "medical": 1385,
            "oop": 312,
            "duration": 1,
            "medicalText": "May require emergency treatment and hospitalization, plus daily medication."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs for your child.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. "
        },
        "desc": {
          "female": ["For children under 15, asthma is the third leading cause of hospitalization.", 
		  "Asthma affects an estimated 7.1 million children under 18.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder."],
          "male": ["For children under 15, asthma is the third leading cause of hospitalization.", 
		  "Asthma affects an estimated 7.1 million children under 18.", 
		  "For children under 18, asthma is the most common lasting disorder.",
		  "For children under 18, asthma is the most common lasting disorder.",
		  "For children under 18, asthma is the most common lasting disorder.",
		  "For children under 18, asthma is the most common lasting disorder.",
		  "For children under 18, asthma is the most common lasting disorder.",
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder.",
		  "For children under 18, asthma is the most common lasting disorder.", 
		  "For children under 18, asthma is the most common lasting disorder."]
        },
        groupPolicies: [
          {
            aflacInsurance: "hospital",
            mild: 150,
            moderate: 1010,
            severe: 2616
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "hospital",
            mild: 250,
            moderate: 837,
            severe: 1150
          }
        ]
      }, {
        "name": "Pneumonia (Child)",
        "id": "pneumonia-child",
        "order": {
          "male": 10,
          "female": 9
        },
        "severities": {
          "mild": {
            "medical": 1370,
            "oop": 206,
            "duration": 0.25,
            "medicalText": "'Walking pneumonia' that can be treated with antibiotics."
          },
          "moderate": {
            "medical": 2055,
            "oop": 411,
            "duration": 0.5,
            "medicalText": "Requires respiratory therapy and antibiotics."
          },
          "severe": {
            "medical": 2740,
            "oop": 617,
            "duration": 1,
            "medicalText": "Requires hospitalization and possible respiratory therapy or pulmonary support."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs for your child.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. "
        },
        "desc": {
          "female": ["For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.",
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.",
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.",
		  "For children under 5, respiratory viruses are the most common cause of pneumonia.",
		  "For children under 5, respiratory viruses are the most common cause of pneumonia."],
          "male": ["For children under 5, respiratory viruses are the most common cause of pneumonia.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls.", 
		  "Pneumonia affects more boys under 18 than girls."]
        },
        groupPolicies: [
          {
            aflacInsurance: "hospital",
            mild: 350,
            moderate: 1489,
            severe: 4550
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "hospital",
            mild: 325,
            moderate: 1079,
            severe: 1400
          }
        ]
      }, {
        "name": "Leukemia (Child)",
        "id": "leukemia-child",
        "order": {
          "male": 11,
          "female": 10
        },
        "severities": {
          "mild": {
            "medical": 133333,
            "oop": 20000,
            "duration": 1,
            "medicalText": "This usually presents no clinical symptoms."
          },
          "moderate": {
            "medical": 200000,
            "oop": 40000,
            "duration": 2,
            "medicalText": "Disruption of normal bone marrow cells that is most often treated with medicines."
          },
          "severe": {
            "medical": 266667,
            "oop": 60000,
            "duration": 3,
            "medicalText": "Advanced/acute cancer that requires chemotherapy treatment."
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as  deductibles, copayments and coinsurance as well as medication costs for your child.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. "
        },
        "desc": {
          "female": ["For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death."],
          "male": ["For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death.",
		  "For children and teens, leukemia is the leading cause of cancer death.", 
		  "For children and teens, leukemia is the leading cause of cancer death."]
        },
        groupPolicies: [
          {
            aflacInsurance: "criticalillness",
            mild: 1045,
            moderate: 5000,
            severe: 11312
          }, {
            aflacInsurance: "hospital",
            mild: 25285,
            moderate: 27346,
            severe: 29406
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "cancer",
            mild: 14343,
            moderate: 49331,
            severe: 73781
          }, {
            aflacInsurance: "hospital",
            mild: 1430,
            moderate: 9830,
            severe: 12910
          }
        ]
      }, {
        "name": "Breast Cancer",
        "id": "breast-cancer",
        "male": false,
        "order": {
          "male": 99,
          "female": 1
        },
        "severities": {
          "mild": {
            "medical": 15385,
            "oop": 2308,
            "duration": 0.5,
            "medicalText": "A biopsy-proven carcinoma is confined to the breast."
          },
          "moderate": {
            "medical": 23078,
            "oop": 4616,
            "duration": 2,
            "medicalText": "Requires antiestrogen medicines, surgery, chemotherapy and/or radiation.  "
          },
          "severe": {
            "medical": 30771,
            "oop": 6923,
            "duration": 4,
            "medicalText": "Aggressive tumors require surgery and/or radiation and chemotherapy. "
          }
        },
        "expenseText": {
          "medical": "You can expect to pay medical expenses that aren't covered by major medical insurance such as deductibles, copayments and coinsurance as well as medication costs.",
          "household": "These are your everyday living expenses like rent or mortgage, car payments, child care and utility bills. ",
          "oop": "You can also count on contending with additional out-of-pocket costs like child care and transportation for follow-up doctor's visits. Traveling to a cancer center might entail travel/lodging, parking and food. Additionally, there may be costs for cosmetic items."
        },
        "desc": {
          "female": ["Breast cancer is the second leading cause of cancer death in women.", 
		  "Breast cancer is the second leading cause of cancer death in women.",
		  "Breast cancer is the second leading cause of cancer death in women.", 
		  "Breast cancer is the second leading cause of cancer death in women.", 
		  "Breast cancer is the second leading cause of cancer death in women.", 
		  "Breast cancer is the second leading cause of cancer death in women.", 
		  "Breast cancer is the second leading cause of cancer death in women.", 
		  "61 is the median age of diagnosis for breast cancer.",
		  "61 is the median age of diagnosis for breast cancer.", 
		  "61 is the median age of diagnosis for breast cancer.",
		  "61 is the median age of diagnosis for breast cancer.", 
		  "61 is the median age of diagnosis for breast cancer.", 
		  "61 is the median age of diagnosis for breast cancer.",
		  "61 is the median age of diagnosis for breast cancer."],
          "male": []
        },
        groupPolicies: [
          {
            aflacInsurance: "criticalillness",
            mild: 1250,
            moderate: 14419,
            severe: 150000
          }, {
            aflacInsurance: "hospital",
            mild: 125,
            moderate: 1885,
            severe: 23363
          }, {
            aflacInsurance: "disability",
            mild: 111,
            moderate: 6431,
            severe: 52800
          }
        ],
        individualPolicies: [
          {
            aflacInsurance: "cancer",
            mild: 1958,
            moderate: 11478,
            severe: 18106
          }, {
            aflacInsurance: "hospital",
            mild: 300,
            moderate: 1180,
            severe: 1680
          }, {
            aflacInsurance: "short-term-disability",
            mild: 900,
            moderate: 4491,
            severe: 6409
          }
        ]
      }
    ];
    rentData = [
      {
        id: "0-999",
        name: "$0-$999",
        value: 499.5
      }, {
        id: "1000-1499",
        name: "$1,000-$1,499",
        value: 1249.5
      }, {
        id: "1500-3499",
        name: "$1,500-$3,499",
        value: 2499.5
      }, {
        id: "3500",
        name: ">$3,500",
        value: 3500
      }
    ];
    incomeData = [
      {
        id: "0-1500",
        name: "$0-$1,500",
        value: 750
      }, {
        id: "1501-2900",
        name: "$1,501-$2,900",
        value: 2200.5
      }, {
        id: "2901-4200",
        name: "$2,901-$4,200",
        value: 3550.5
      }, {
        id: "4201-6250",
        name: "$4,201-$6,250",
        value: 5225.5
      }, {
        id: "6251-8350",
        name: "$6,251-$8,350",
        value: 7300.5
      }, {
        id: "8351-12500",
        name: "$8,351-$12,500",
        value: 10425.5
      }, {
        id: "12501",
        name: ">$12,501",
        value: 12501
      }
    ];
    familyData = [
      {
        id: "single",
        name: "Single",
        value: 90
      }, {
        id: "couple",
        name: "Couple",
        value: 76
      }, {
        id: "couple-with-children",
        name: "Couple with Children",
        value: 74
      }, {
        id: "single-with-children",
        name: "Single with Children",
        value: 77
      }
    ];
    insuranceData = [
      {
        id: "major-low",
        type: "major",
        level: "low",
        name: "Low",
        coverage: 20
      }, {
        id: "major-medium",
        type: "major",
        level: "medium",
        name: "Medium",
        coverage: 40
      }, {
        id: "major-high",
        type: "major",
        level: "high",
        name: "High",
        coverage: 80
      }, {
        id: "marketplace-bronze",
        type: "marketplace",
        level: "bronze",
        name: "Bronze",
        coverage: 25
      }, {
        id: "marketplace-silver",
        type: "marketplace",
        level: "silver",
        name: "Silver",
        coverage: 30
      }, {
        id: "marketplace-gold",
        type: "marketplace",
        level: "gold",
        name: "Gold",
        coverage: 50
      }, {
        id: "marketplace-platinum",
        type: "marketplace",
        level: "platinum",
        name: "Platinum",
        coverage: 70
      }, {
        id: "advanced",
        type: "advanced",
        level: "advanced",
        name: "Advanced",
        coverage: 0
      }
    ];
    aflacInsurancesData = [
      {
        id: "cancer",
        name: "Cancer/Specified-Disease",
        desc: "Aflac's cancer/specified-disease insurance provides cash benefits to help pay for cancer treatment as well as costs associated with daily living.",
        availability: "Available: through your employer.",
        img: "cancer"
      }, {
        id: "accident",
        name: "Accident",
        desc: "Aflac accident insurance provides cash benefits to help pay for unexpected expenses and ongoing living expenses.",
        availability: "Available: through your employer.",
        img: "accident"
      }, {
        id: "hospital",
        name: "Hospital Confinement <br/>Indemnity",
        desc: "Aflac hospital confinement indemnity insurance pays cash benefits to help with the out-of-pocket expenses associated with a hospital stay.",
        availability: "Available: through your employer.",
        img: "hosp-confinement"
      }, {
        id: "disability",
        name: "Disability",
        desc: "In the case of illness or injury, Aflac Disability insurance helps with your bills while you are unable to work.",
        availability: "Available: through your employer.",
        img: "disability"
      }, {
        id: "short-term-disability",
        name: "Short Term Disability",
        desc: "In the case of illness or injury, Aflac Short-Term Disability insurance helps pay your bills while you are unable to work.",
        availability: "Available: through your employer.",
        img: "short-term-disability"
      }, {
        id: "criticalillness",
        name: "Critical Care & Recovery <br/>(Specified Health Event)",
        desc: "Critical care and recovery insurance may make all the difference by providing cash benefits as you concentrate on your recovery.",
        availability: "Available: directly from us & your employer.",
        img: "critical-illness"
      }, {
        name: "Life",
        id: "life",
        desc: "Aflac Life insurance helps protect your family if something happens to you.",
        availability: "Available: directly from us & your employer.",
        img: "life"
      }, {
        name: "Juvenile Life",
        id: "juvenilelife",
        desc: "Juvenile life insurance helps provide peace of mind by knowing that your family can be financially protected, even in the toughest of times.",
        availability: "Available: directly from us & your employer.",
        img: "life"
      }, {
        name: "Vision",
        id: "vision",
        desc: "Aflac vision insurance policy goes beyond traditional vision plans with benefits for eye surgeries, specific eye diseases and permanent visual impairment.",
        availability: "Available: directly from us & your employer.",
        img: "life"
      }, {
        name: "Dental",
        id: "dental",
        desc: "With Aflac dental insurance, you receive competitive rates and rate stability with no network restrictions and no deductibles.",
        availability: "Available: directly from us & your employer.",
        img: "life"
      }, {
        name: "Medicare Supplement",
        id: "medicare",
        desc: "Medicare Supplement insurance enhances your Medicare Part A and Part B plans and helps cover services, fees and out-of-pocket costs.",
        availability: "Available: directly from us & your employer.",
        img: "accident"
      }, {
        name: "Hospital Confinement Sickness Indemnity",
        id: "hospitalconfinement",
        desc: "Aflac hospital confinement sickness indemnity insurance helps ease the financial burden of hospital stays with cash benefits and a physician visit feature.",
        availability: "Available: through your employer.",
        img: "hosp-confinement"
      }, {
        name: "Hospital Intensive Care",
        id: "intensivecare",
        desc: "A hospital intensive care insurance policy provides cash benefits for accidents or illnesses that result in an admission to a hospital intensive care unit.",
        availability: "Available: through your employer.",
        img: "critical-illness"
      }
    ];
    return {
      diseaseData: diseaseData,
      familyData: familyData,
      incomeData: incomeData,
      insuranceData: insuranceData,
      aflacInsurancesData: aflacInsurancesData,
      promptCloseMsg: "Your Changes will not be saved.",
      promptCloseTitle: "Are you sure you<br>want to exit?",
      rentData: rentData,
      currency: "$"
    };
  });
}).call(this);