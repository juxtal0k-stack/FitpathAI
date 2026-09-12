import { ExerciseStepGuide } from '../types';

export const EXERCISE_STEP_GUIDES: Record<string, ExerciseStepGuide> = {
  // 1. Push-ups
  'push-ups': {
    id: 'push-ups',
    name: 'Dorm/Home Incline or Floor Push-Ups',
    category: 'Upper Body',
    equipmentNeeded: 'Zero Equipment (Bed frame, desk edge, or floor)',
    targetMuscles: {
      primary: 'Pectoralis Major (Chest), Triceps Brachii',
      secondary: 'Anterior Deltoids, Serratus Anterior, Core Stabilizers'
    },
    difficulty: 'Beginner',
    startingPosition: 'Place hands slightly wider than shoulder-width on the floor (or elevated on desk/bed for beginners). Extend legs back with balls of feet anchored. Lock knees, squeeze glutes, and tuck pelvis slightly so your body forms a rigid, unbroken plank line from head to heels.',
    stepByStepExecution: [
      'Step 1 (Brace & Grip): Screw your palms into the surface as if trying to tear the floor apart to externally rotate shoulders. Look slightly ahead at a spot 30cm on the ground.',
      'Step 2 (The Descent): Inhale deeply through your nose and lower your chest under control for 2 full seconds. Keep elbows angled back at 45 degrees like an arrow, never flaring out perpendicular to your neck.',
      'Step 3 (The Bottom Pause): Lower until your chest is 2-3 cm from the floor or edge. Pause for a brief 0.5s moment without letting hips sag or belly collapse.',
      'Step 4 (Concentric Push): Exhale forcefully through pursed lips and push the floor away powerfully. Return to the starting plank, locking out triceps smoothly at the top.'
    ],
    breathingCues: {
      inhale: 'Inhale steadily through your nose as you lower your body down towards the floor (eccentric phase).',
      exhale: 'Exhale forcefully through your mouth as you press away from the surface back up (concentric phase).'
    },
    commonMistakes: [
      {
        mistake: 'Flaring elbows outward at a 90-degree "T" shape.',
        correction: 'Keep elbows tucked at a 45-degree arrow angle relative to your torso to protect shoulder rotator cuffs.'
      },
      {
        mistake: 'Sagging hips or hyperextending the lumbar lower back.',
        correction: 'Clench your glutes hard and brace your abs as if anticipating a punch before initiating every rep.'
      },
      {
        mistake: 'Craning neck downward or bobbing head instead of lowering chest.',
        correction: 'Keep cervical spine in neutral alignment with your back; lead down with the sternum, not the chin.'
      }
    ],
    homeModifications: {
      easier: 'Incline Push-Ups against a study desk, bed frame, or sturdy wall. Takes off 30-50% of bodyweight load.',
      harder: 'Decline Push-Ups (feet propped up on bed or chair) or 3-second eccentric tempo down.'
    },
    postureChecks: [
      'Hands stacked under shoulders with fingers spread for wrist weight distribution',
      'Shoulder blades retract smoothly on the way down and spread open (protract) at the top',
      'Neutral cervical spine with glutes and quads locked rigid throughout'
    ],
    recommendedRepsOrTime: '3 sets of 8-15 reps (or 35 seconds continuous tempo)',
    medicalSafetyRule: 'Rotator Cuff & Subacromial Decompression: Maintain a 45° arrow elbow angle to prevent the supraspinatus tendon from pinching against the acromion bone. If wrist pain arises, elevate hands onto a desk edge or perform on neutral fists to eliminate wrist hyperextension.',
    injuryPrevention: {
      primaryRisk: 'Subacromial impingement syndrome and wrist dorsal impaction syndrome.',
      preventionTechnique: 'Never drop lower than the point where shoulders roll forward. Stop descent when chest is level with elbows.',
      anatomicalCue: 'Retract scapulae on descent; push chest away and protract at the lockout.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Gaze directed 30cm ahead; chin packed in neutral retraction, not drooping.',
      torsoAndSpine: 'Transverse abdominis drawn tight; no sag in lumbar vertebrae.',
      pelvisAndHips: 'Posterior pelvic tilt; glutes clenched to form unbroken diagonal line.',
      limbsAndJoints: 'Wrists directly beneath shoulder joints; elbows tracking 45 degrees back.'
    },
    contraindications: [
      'Acute rotator cuff tear or active bursitis',
      'Severe carpal tunnel flare-up (use incline fists instead)',
      'Recent sternoclavicular or acromioclavicular sprain'
    ]
  },

  // 2. Air Squats
  'air-squats': {
    id: 'air-squats',
    name: 'Bodyweight Tempo Air Squats (to Chair Tap)',
    category: 'Lower Body',
    equipmentNeeded: 'Zero Equipment (Floor space or standard dorm chair for depth reference)',
    targetMuscles: {
      primary: 'Quadriceps, Gluteus Maximus',
      secondary: 'Hamstrings, Calves, Core Abdominals'
    },
    difficulty: 'Beginner',
    startingPosition: 'Stand with feet shoulder-width apart, toes turned out 10 to 15 degrees. Interlace fingers at chest or extend arms straight ahead for counter-balance. Keep chest proud and eyes forward.',
    stepByStepExecution: [
      'Step 1 (Root & Brace): Grip the floor with your toes and heels ("tripod foot"). Inhale into your belly and brace your core.',
      'Step 2 (The Hinge & Squat): Initiate the movement by unlocking the hips backward, then bending knees simultaneously. Track your knees directly in line with your second toe.',
      'Step 3 (Depth & Pause): Lower under a 2-second control until your thighs are parallel to the floor (or lightly graze the chair seat behind you). Keep weight balanced through the midfoot.',
      'Step 4 (Drive Up): Exhale and drive through the whole foot, pressing hips forward to stand tall. Squeeze your glutes at the top without hyperextending backward.'
    ],
    breathingCues: {
      inhale: 'Take a deep diaphragmatic breath in as you initiate the hip hinge and descend.',
      exhale: 'Exhale smoothly as you drive through your heels and stand back up to starting position.'
    },
    commonMistakes: [
      {
        mistake: 'Knees caving inward (valgus collapse) during descent or ascent.',
        correction: 'Actively push knees outward against an imaginary resistance band throughout the entire rep.'
      },
      {
        mistake: 'Heels lifting off the ground or shifting all weight onto toes.',
        correction: 'Anchor your heels firmly. If ankles feel tight, elevate heels slightly on a folded towel or notebook.'
      },
      {
        mistake: 'Rounding the upper or lower back when reaching bottom depth.',
        correction: 'Keep chest upright, proud collarbones, and only descend as far as you can maintain a neutral lumbar spine.'
      }
    ],
    homeModifications: {
      easier: 'Box Squat onto a study chair or bed: sit down gently, pause 1 second, then stand up.',
      harder: '1.5 Rep Squats (descend, come up halfway, descend again, stand up) or wear a backpack with 2-3 textbooks.'
    },
    postureChecks: [
      'Weight distributed 50/50 between ball of foot and heel',
      'Knees track over toes, never caving inward',
      'Torso angle stays parallel with shin angle'
    ],
    recommendedRepsOrTime: '3-4 sets of 15-20 reps',
    medicalSafetyRule: 'Patellofemoral Shear & Lumbar Protection: Never allow knees to collapse inwards (valgus stress) which places excessive torsional strain on the ACL and meniscus. Descend only as far as lumbar lordosis can be maintained without "butt wink" pelvic tucking.',
    injuryPrevention: {
      primaryRisk: 'Patellofemoral pain syndrome (runner\'s knee) and lumbar disc shear.',
      preventionTechnique: 'Use a study chair as an artificial depth limiter; touch the chair lightly without bouncing.',
      anatomicalCue: 'Screw feet into floor to activate external hip rotators (gluteus medius).'
    },
    correctPostureChecklist: {
      headAndNeck: 'Eyes fixed at eye level; crown of head reaching high.',
      torsoAndSpine: 'Erector spinae active; chest proud with neutral rib cage.',
      pelvisAndHips: 'Hip hinge initiates before knee bend; pelvis remains neutral at bottom.',
      limbsAndJoints: 'Knees track over 2nd & 3rd toes; entire sole in contact with floor.'
    },
    contraindications: [
      'Acute meniscus tear with locking symptoms',
      'Severe patellar tendinitis (limit depth to 60 degrees)',
      'Acute lower back disc protrusion during flare-up'
    ]
  },

  // 3. Doorframe Scapular Rows
  'doorframe-rows': {
    id: 'doorframe-rows',
    name: 'Doorframe / Towel Isometric Scapular Rows',
    category: 'Upper Body',
    equipmentNeeded: 'Zero Equipment (Sturdy doorframe, door jamb, or a bath towel looped around a knob)',
    targetMuscles: {
      primary: 'Rhomboids, Middle & Lower Trapezius, Latissimus Dorsi',
      secondary: 'Biceps Brachii, Posterior Deltoid, Forearm Grip'
    },
    difficulty: 'Beginner',
    startingPosition: 'Stand facing the inside edge of a doorway. Grip the doorframe at chest height with both hands (or wrap a sturdy towel around the door handles). Place your toes close to the base of the doorframe and lean back until arms are fully extended at an angle.',
    stepByStepExecution: [
      'Step 1 (Angle & Set): Step feet forward to increase difficulty (steeper incline) or backward to make it lighter. Keep body in a straight plank line.',
      'Step 2 (Retraction): Before bending elbows, initiate the pull by pinching your shoulder blades together as if holding a pencil between them.',
      'Step 3 (Row to Chest): Exhale and pull your chest up towards the doorframe by driving elbows backward past your ribs. Stop when chest touches or nears the frame.',
      'Step 4 (Peak Squeeze & Return): Squeeze your upper back muscles hard for a 2-second hold at the top. Inhale and slowly lower your body back over 3 seconds to full arm extension.'
    ],
    breathingCues: {
      inhale: 'Inhale deeply as you slowly lower your body away from the doorframe.',
      exhale: 'Exhale with control as you pull your chest up to meet the frame.'
    },
    commonMistakes: [
      {
        mistake: 'Pulling entirely with arm biceps rather than engaging back shoulder blades.',
        correction: 'Think about driving your elbows behind you, not pulling with your hands.'
      },
      {
        mistake: 'Shrugging shoulders up toward your ears during the pull.',
        correction: 'Depress your shoulders down away from ears to keep upper traps relaxed.'
      },
      {
        mistake: 'Bending at the waist or sagging hips during the row.',
        correction: 'Keep glutes clenched and core rigid so whole body moves as one solid unit.'
      }
    ],
    homeModifications: {
      easier: 'Stand more vertically (feet farther back) to reduce gravitational resistance.',
      harder: 'Walk feet closer into the doorframe for a horizontal pull, or perform with one arm at a time.'
    },
    postureChecks: [
      'Chest opens wide at the top',
      'Shoulder blades pinched firmly together',
      'No cervical neck straining forward towards the door'
    ],
    recommendedRepsOrTime: '3 sets of 12-15 reps with a 2-second peak pause',
    medicalSafetyRule: 'Cervical & Thoracic Postural Restoration: Counters upper cross syndrome caused by hours of laptop screen study. Do not crane your neck forward to reach the doorframe; keep cervical spine packed and shoulders depressed away from ears.',
    injuryPrevention: {
      primaryRisk: 'Levator scapulae and upper trapezius hypertonicity / tension headaches.',
      preventionTechnique: 'Initiate with pure scapular retraction prior to elbow flexion.',
      anatomicalCue: 'Depress shoulders down into back pockets; avoid shoulder rolling.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Double chin chin-tuck posture; crown elongated.',
      torsoAndSpine: 'Thoracic extension with ribs pinned down.',
      pelvisAndHips: 'Straight hip angle; glutes engaged to prevent sagging.',
      limbsAndJoints: 'Forearms in line with cable/towel path; elbows glide past ribs.'
    },
    contraindications: [
      'Acute bicep tendonitis at the long head',
      'Severe cervical radiculopathy during neck extension'
    ]
  },

  // 4. Bedside Walking Lunges / Split Squats
  'walking-lunges': {
    id: 'walking-lunges',
    name: 'Bedside Alternating Walking Lunges or Split Squats',
    category: 'Lower Body',
    equipmentNeeded: 'Zero Equipment (2 meters of clear dorm floor space)',
    targetMuscles: {
      primary: 'Quadriceps, Gluteus Medius, Gluteus Maximus',
      secondary: 'Hamstrings, Hip Flexors, Calves, Ankle Stabilizers'
    },
    difficulty: 'Beginner',
    startingPosition: 'Stand tall with feet hip-width apart, hands resting on hips or clasped at chest. Engage your abdominal core and fix your gaze straight ahead.',
    stepByStepExecution: [
      'Step 1 (Forward Step): Take a controlled, exaggerated step forward (approx. 60-90 cm). Land softly heel-first onto the front foot.',
      'Step 2 (The Drop): Inhale and drop your hips straight down toward the floor until both front and back knees bend to approximately 90-degree angles.',
      'Step 3 (Hover Depth): Stop just before your back knee contacts the floor (hovering 1-2 cm above). Ensure the front knee is directly above your front ankle.',
      'Step 4 (Drive Through Front Heel): Exhale and press forcefully through your front heel and midfoot. Step the back leg forward into the next lunge step, or push back to starting position.'
    ],
    breathingCues: {
      inhale: 'Inhale steadily as you step and sink downward into the lunge.',
      exhale: 'Exhale forcefully as you drive up through the front heel.'
    },
    commonMistakes: [
      {
        mistake: 'Front knee pushing excessively forward over the toes or caving inward.',
        correction: 'Think of dropping your hips straight down like an elevator, not sliding forward like an escalator.'
      },
      {
        mistake: 'Leaning the torso excessively forward or rounding shoulders.',
        correction: 'Keep your spine perpendicular to the floor with shoulders stacked directly over hips.'
      },
      {
        mistake: 'Banging the rear knee onto hard dormitory tiles.',
        correction: 'Control the descent with your quads and stop 2cm above the ground.'
      }
    ],
    homeModifications: {
      easier: 'Stationary Split Squat: keep feet in place with hand lightly touching a wall or chair for balance.',
      harder: 'Bulgarian Split Squat: rest rear foot elevated on your bed frame or desk chair.'
    },
    postureChecks: [
      'Front knee aligned over 2nd toe',
      'Torso vertical and upright',
      'Hips remain square to the front wall'
    ],
    recommendedRepsOrTime: '3 sets of 10-12 reps per leg (20-24 total steps)',
    medicalSafetyRule: 'Unilateral Hip & Sacroiliac Alignment: Keep hips parallel and prevent pelvic drop (Trendelenburg sign) on the trailing leg. Maintain 90° knee flexion to keep anterior shear force on the patellar tendon minimal.',
    injuryPrevention: {
      primaryRisk: 'Patellar tendon irritation and sacroiliac joint torsion.',
      preventionTechnique: 'Keep weight loaded on front heel and midfoot; do not allow heel to rise.',
      anatomicalCue: 'Square pelvis forward; imagine headlights on your hip bones pointing straight.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Neutral gaze forwards; shoulders relaxed.',
      torsoAndSpine: 'Upright torso aligned vertically over hips.',
      pelvisAndHips: 'Pelvis level horizontally with active glute medius stabilizing hip.',
      limbsAndJoints: 'Front knee stacked over ankle; rear knee hovering 2cm above floor.'
    },
    contraindications: [
      'Acute prepatellar or infrapatellar bursitis',
      'Severe ankle sprain with compromised dorsiflexion',
      'Acute sacroiliac joint subluxation'
    ]
  },

  // 5. Floor Deadbug & Hollow Body Hold
  'deadbug-core': {
    id: 'deadbug-core',
    name: 'Floor Deadbug & Hollow Body Core Hold',
    category: 'Core',
    equipmentNeeded: 'Zero Equipment (Dorm floor or yoga mat)',
    targetMuscles: {
      primary: 'Transverse Abdominis (Deep Core), Rectus Abdominis',
      secondary: 'Obliques, Hip Flexors, Lower Back Stabilizers'
    },
    difficulty: 'Beginner',
    startingPosition: 'Lie flat on your back on the floor. Raise arms straight toward the ceiling. Bend knees to 90 degrees with shins parallel to the ground (knees directly above hips). Crucially: tilt pelvis backwards and push your lower back flat into the floor—there should be zero gap under your lumbar spine.',
    stepByStepExecution: [
      'Step 1 (Posterior Pelvic Tilt): Actively press the small of your back into the floor. Maintain this abdominal brace at all times.',
      'Step 2 (Opposite Reach): Inhale through your nose and slowly extend your right arm backwards overhead while simultaneously extending your left leg straight forward 5cm above the floor.',
      'Step 3 (End-Range Hold): Pause at the extended position for 1 second. Ensure your lower back remains firmly glued to the floor.',
      'Step 4 (Controlled Reset): Exhale and slowly return your right arm and left leg to the center 90/90 position. Alternate smoothly to the left arm and right leg.'
    ],
    breathingCues: {
      inhale: 'Inhale into your ribs as the limbs extend outward.',
      exhale: 'Exhale completely through your mouth as you draw limbs back together, reinforcing your ab brace.'
    },
    commonMistakes: [
      {
        mistake: 'Lower back arching off the floor as legs extend forward.',
        correction: 'Only lower your leg as far as you can keep your lumbar spine completely glued to the floor.'
      },
      {
        mistake: 'Rushing the reps or moving arms and legs out of sync.',
        correction: 'Perform each rep slowly with a 3-second cadence to maximize deep transverse abdominal activation.'
      },
      {
        mistake: 'Tensing neck and shoulders up toward ears.',
        correction: 'Keep the back of your head and shoulder blades relaxed on the floor.'
      }
    ],
    homeModifications: {
      easier: 'Perform with bent knees tapping the heel on the floor rather than extending leg straight.',
      harder: 'Full Hollow Body Hold: hold both arms overhead and both legs extended 10cm off floor for 30 seconds.'
    },
    postureChecks: [
      'Zero light or gap under your lower back',
      'Shoulders relaxed on floor',
      'Movement is slow and controlled'
    ],
    recommendedRepsOrTime: '3 sets of 10 slow reps per side (20 total) or 45s hold',
    medicalSafetyRule: 'Lumbar Spine Zero-Compression Stabilization: Classified as a McGill Big 3 gold-standard spine saver. It activates the deep transverse abdominis without any flexion or torsion on lumbar intervertebral discs.',
    injuryPrevention: {
      primaryRisk: 'Hyperextension of lumbar facet joints and psoas dominance.',
      preventionTechnique: 'If the lower back leaves the floor by even 1 millimeter, immediately reduce leg extension range.',
      anatomicalCue: 'Exhale fully to depress the lower ribs down towards the hip crests.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Occiput resting comfortably on floor; neck relaxed.',
      torsoAndSpine: 'Entire lumbar spine flattened firmly against floor surface.',
      pelvisAndHips: 'Active posterior pelvic tilt; transverse abdominis cylinder braced.',
      limbsAndJoints: 'Arm and contralateral leg extend simultaneously with slow tempo.'
    },
    contraindications: [
      'Acute abdominal hernia',
      'Recent abdominal surgery'
    ]
  },

  // 6. Wall Sit & Calf Raises
  'wall-sit': {
    id: 'wall-sit',
    name: 'Wall Sit with Alternating Calf Raises',
    category: 'Lower Body',
    equipmentNeeded: 'Zero Equipment (Any smooth dorm or home wall)',
    targetMuscles: {
      primary: 'Quadriceps (Isometric), Gastrocnemius, Soleus (Calves)',
      secondary: 'Glutes, Hip Stabilizers, Abdominals'
    },
    difficulty: 'Beginner',
    startingPosition: 'Lean your back flat against an empty wall. Slide down until your knees and hips are both bent at 90-degree right angles (thighs completely parallel to the floor). Feet should be flat on the ground, shoulder-width apart, with shins vertical.',
    stepByStepExecution: [
      'Step 1 (Wall Anchor): Press your entire spine—upper back, lower back, and head—firmly against the wall. Place hands flat against wall or across chest (never resting on thighs).',
      'Step 2 (The Hold): Breathe deeply through your nose. Keep quads engaged under constant isometric tension.',
      'Step 3 (Calf Raise Pulse): While holding the 90-degree sit, lift your heels as high off the floor as possible, pushing through the balls of your feet.',
      'Step 4 (Lower & Repeat): Lower heels back to the floor under control while maintaining the squat depth. Repeat calf pulses every 3-4 seconds throughout the duration.'
    ],
    breathingCues: {
      inhale: 'Slow nasal breath in for 4 seconds to calm heart rate and prevent cortisol spikes.',
      exhale: 'Slow controlled mouth exhale for 4 seconds while pressing heels up.'
    },
    commonMistakes: [
      {
        mistake: 'Resting hands or elbows on knees/thighs to relieve quad tension.',
        correction: 'Keep arms folded across your chest or dangling freely at your sides.'
      },
      {
        mistake: 'Hips resting too high (120-degree angle instead of 90 degrees).',
        correction: 'Check that thighs are truly parallel to the floor; knee joints should be at right angles.'
      },
      {
        mistake: 'Feet placed too close to the wall, causing knees to drift past toes.',
        correction: 'Step feet forward so shins are perpendicular to the floor.'
      }
    ],
    homeModifications: {
      easier: 'Slide up 5-10cm so knees are at ~110 degrees for reduced joint stress.',
      harder: 'Single-leg Wall Sit (extend one leg out straight) or hold a heavy textbook on your lap.'
    },
    postureChecks: [
      'Lower back touching the wall',
      'Thighs parallel to the ground',
      'Nasal breathing maintained'
    ],
    recommendedRepsOrTime: '3 sets of 30 to 50 seconds hold',
    medicalSafetyRule: 'Low-Impact Isometric Knee Conditioning: Provides massive quadriceps motor unit recruitment with zero knee joint translation. Safe for individuals with previous ligament reconstructions as shear forces are minimal.',
    injuryPrevention: {
      primaryRisk: 'Excessive patellofemoral compressive force if feet are placed too close to the wall.',
      preventionTechnique: 'Ensure shins form an exact 90° angle perpendicular to the floor.',
      anatomicalCue: 'Press entire sacrum and mid-back flat into the wall surface.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Back of head against wall; gaze horizontal.',
      torsoAndSpine: 'Thoracic and lumbar curves supported against wall.',
      pelvisAndHips: 'Hips at knee level (90 degrees); pelvis stable.',
      limbsAndJoints: 'Shins strictly perpendicular; knees tracking second toe.'
    },
    contraindications: [
      'Acute chondromalacia patellae flare-up (elevate to 110 degrees)',
      'Severe calf gastrocnemius strain during calf pulse'
    ]
  },

  // 7. Supine Glute Bridges
  'glute-bridges': {
    id: 'glute-bridges',
    name: 'Supine Glute Bridges & Hamstring Walkouts',
    category: 'Lower Body',
    equipmentNeeded: 'Zero Equipment (Floor or carpet)',
    targetMuscles: {
      primary: 'Gluteus Maximus, Hamstrings',
      secondary: 'Erector Spinae, Core, Adductors'
    },
    difficulty: 'Beginner',
    startingPosition: 'Lie on your back with knees bent and feet flat on the floor, hip-distance apart, about 15-20 cm away from your glutes. Arms rest by your sides with palms down.',
    stepByStepExecution: [
      'Step 1 (Pelvic Neutral): Press lower back into floor and contract abdominal core.',
      'Step 2 (Drive Up): Exhale and drive down into the floor through your heels. Lift hips until your knees, hips, and shoulders form one straight diagonal line.',
      'Step 3 (Peak Squeeze): At the peak, clamp your glutes as hard as possible for 2 seconds. Do not hyperextend your lower back past straight alignment.',
      'Step 4 (Descent): Inhale and lower your hips under control until they tap the floor lightly, then immediately drive back up.'
    ],
    breathingCues: {
      inhale: 'Inhale steadily on the way down as hips approach the floor.',
      exhale: 'Exhale with emphasis as you drive through your heels and bridge hips up.'
    },
    commonMistakes: [
      {
        mistake: 'Overarching the lower lumbar back at the top.',
        correction: 'Stop the movement once hips align with knees and shoulders; feel the contraction purely in glutes.'
      },
      {
        mistake: 'Pushing from the toes rather than the heels.',
        correction: 'Lift toes slightly off the ground to ensure 100% of force travels through your heels.'
      },
      {
        mistake: 'Knees splaying outward or knocking together.',
        correction: 'Keep knees tracking directly in line with hips and second toe.'
      }
    ],
    homeModifications: {
      easier: 'Standard two-leg Glute Bridge with 1-second pause at the top.',
      harder: 'Single-Leg Glute Bridge (extend one leg straight up) or Hamstring Walkout (walk heels forward 3 steps).'
    },
    postureChecks: [
      'Straight diagonal from shoulders to knees at top',
      'No hyperextension in lumbar spine',
      'Glutes actively firing'
    ],
    recommendedRepsOrTime: '3 sets of 15-20 reps with 2s hold',
    medicalSafetyRule: 'Posterior Pelvic Alignment & Desk-Sit Reversal: Bridges reverse prolonged desk-sitting hip flexor shortening and "gluteal amnesia". Stop lifting as soon as hips align with knees and shoulders to avoid lumbar hyperextension.',
    injuryPrevention: {
      primaryRisk: 'Lumbar facet joint jamming from hyper-bridging.',
      preventionTechnique: 'Focus on tucking the tailbone slightly under (posterior tilt) at apex.',
      anatomicalCue: 'Think about driving your knees forward over toes, not throwing hips to ceiling.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Resting neutrally on floor; neck relaxed.',
      torsoAndSpine: 'Straight line from knee to shoulder; no rib flaring.',
      pelvisAndHips: 'Symmetric hip elevation; glutes clenched at peak.',
      limbsAndJoints: 'Weight driven 100% through calcaneus heels; toes relaxed.'
    },
    contraindications: [
      'Acute spondylolisthesis during lumbar extension',
      'Severe acute hamstring strain'
    ]
  },

  // 8. Chair / Desk Tricep Dips
  'chair-dips': {
    id: 'chair-dips',
    name: 'Desk / Chair Tricep Dip Pulses',
    category: 'Upper Body',
    equipmentNeeded: 'Zero Equipment (Sturdy dorm chair, desk edge, or bed frame)',
    targetMuscles: {
      primary: 'Triceps Brachii',
      secondary: 'Anterior Deltoids, Pectoralis Major, Scapular Stabilizers'
    },
    difficulty: 'Beginner',
    startingPosition: 'Sit on the edge of a sturdy chair or bed. Place your palms directly beside your hips with fingers curling over the front edge. Slide your glutes forward off the chair, supporting bodyweight with arms straight. Bend knees 90 degrees with feet flat on the floor.',
    stepByStepExecution: [
      'Step 1 (Depress Shoulders): Push down into the chair to drive shoulders away from ears. Keep chest open and collarbones wide.',
      'Step 2 (The Dip): Inhale and bend your elbows, lowering your hips straight down past the front edge of the chair for 2 seconds.',
      'Step 3 (Depth Check): Lower until your upper arms are parallel to the floor (approx. 90-degree elbow bend). Never descend lower to avoid shoulder impingement.',
      'Step 4 (Press to Lockout): Exhale and push through palms to straighten arms, contracting triceps hard at the top.'
    ],
    breathingCues: {
      inhale: 'Inhale through your nose as you lower your body down in front of the chair.',
      exhale: 'Exhale firmly through your mouth as you press your hands down to straighten your arms.'
    },
    commonMistakes: [
      {
        mistake: 'Letting shoulders roll forward and shrug up into ears.',
        correction: 'Keep shoulders pinned back and down throughout the entire movement.'
      },
      {
        mistake: 'Drifting hips too far forward away from the chair.',
        correction: 'Keep your back skimming within 5cm of the chair edge to prevent shoulder strain.'
      },
      {
        mistake: 'Dropping elbows below 90 degrees.',
        correction: 'Cap depth at a 90-degree angle to safely protect anterior shoulder capsules.'
      }
    ],
    homeModifications: {
      easier: 'Keep knees bent at 90 degrees with feet close to the chair, sharing bodyweight with legs.',
      harder: 'Extend legs completely straight with heels on floor, or elevate feet onto a second chair.'
    },
    postureChecks: [
      'Back skims close to chair edge',
      'Elbows point straight back, not flared outward',
      'Shoulders pushed down away from ears'
    ],
    recommendedRepsOrTime: '3 sets of 10-15 reps',
    medicalSafetyRule: 'Glenohumeral Joint Safety: Never descend past a 90° elbow bend. Descending below 90° creates extreme anterior translation of the humeral head, risking anterior labrum tears and capsule stretching.',
    injuryPrevention: {
      primaryRisk: 'Anterior capsule laxity and shoulder impingement.',
      preventionTechnique: 'Keep back within 5cm of chair edge; do not let hips drift forward.',
      anatomicalCue: 'Active shoulder depression: keep collarbones wide and proud.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Neutral cervical spine; no forward head jutting.',
      torsoAndSpine: 'Upright torso close to chair edge.',
      pelvisAndHips: 'Hips drop strictly vertically.',
      limbsAndJoints: 'Elbows track straight backward, never flaring laterally.'
    },
    contraindications: [
      'Previous anterior shoulder dislocation or subluxation',
      'Active bicipital groove tendinitis',
      'Carpal tunnel wrist compression'
    ]
  },

  // 9. Hybrid / Cardio: High-Knee Cadence Sprints
  'high-knees': {
    id: 'high-knees',
    name: 'High-Knee Cadence Sprints (Cardio Engine)',
    category: 'Full Body / Cardio',
    equipmentNeeded: 'Zero Equipment (Running shoes or carpeted floor)',
    targetMuscles: {
      primary: 'Hip Flexors (Psoas), Calves (Gastrocnemius), Core',
      secondary: 'Quadriceps, Glutes, Cardiovascular VO2 System'
    },
    difficulty: 'Intermediate',
    startingPosition: 'Stand tall with feet hip-width apart, arms bent at 90-degree angles as if running.',
    stepByStepExecution: [
      'Step 1 (Rhythm Initiation): Begin driving one knee up toward your chest until thigh is parallel to floor.',
      'Step 2 (Opposite Arm Drive): Drive opposite arm forward in rhythm, keeping elbows bent at 90 degrees.',
      'Step 3 (Springy Foot Strike): Land softly and spring off the ball of your foot, immediately driving the opposite knee upward.',
      'Step 4 (Cadence Pacing): Maintain a high cycling frequency of 140+ RPM, staying light and agile on your toes.'
    ],
    breathingCues: {
      inhale: 'Rhythmic nasal inhalation for 2 foot strikes.',
      exhale: 'Sharp mouth exhalation for 2 foot strikes (2:2 breathing cadence).'
    },
    commonMistakes: [
      {
        mistake: 'Leaning the torso backward to hoist knees up.',
        correction: 'Keep a slight forward lean from the ankles, keeping core braced.'
      },
      {
        mistake: 'Stamping heels loudly on the floor.',
        correction: 'Stay strictly on the balls of your feet for quiet, spring-like elastic recoil.'
      },
      {
        mistake: 'Letting arms cross the midline of the body.',
        correction: 'Pump arms straight forward and back from hip to cheek.'
      }
    ],
    homeModifications: {
      easier: 'Brisk March in Place: drive knees high without jumping or impacting floor (quiet dorm mode).',
      harder: 'Sprint Cadence: maximum turnover for 30s intervals with 15s rest.'
    },
    postureChecks: [
      'Knees reach hip height on every cycle',
      'Torso slightly forward, core tight',
      'Soft, quiet foot landing'
    ],
    recommendedRepsOrTime: '3-4 rounds of 45 seconds work / 15 seconds rest',
    medicalSafetyRule: 'High-Impact Ground Reaction Force Absorption: Land softly on the forefoot/midfoot with ankle and knee flexion to dissipate impact force. If you experience shin splints or plantar fasciitis, switch to non-impact high-march.',
    injuryPrevention: {
      primaryRisk: 'Medial tibial stress syndrome (shin splints) and metatarsal stress.',
      preventionTechnique: 'Maintain high step frequency (150+ RPM) with short ground contact times.',
      anatomicalCue: 'Spring off the balls of feet; absorb energy with calf elasticity.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Neutral head aligned with torso.',
      torsoAndSpine: 'Slight forward lean of 5° from ankles; core braced.',
      pelvisAndHips: 'Pelvis level; hip flexor drives knee to 90 degrees.',
      limbsAndJoints: 'Forefoot contact; elbows pump in sagittal plane.'
    },
    contraindications: [
      'Active shin splints (medial tibial stress syndrome)',
      'Uncontrolled stage 2 hypertension (avoid maximum sprint)',
      'Plantar fasciitis acute heel pain'
    ]
  },

  // 10. Mountain Climbers
  'mountain-climbers': {
    id: 'mountain-climbers',
    name: 'Speed Mountain Climbers to Plank Hold',
    category: 'Full Body / Cardio',
    equipmentNeeded: 'Zero Equipment (Floor space)',
    targetMuscles: {
      primary: 'Rectus Abdominis, Obliques, Cardiovascular System',
      secondary: 'Shoulder Deltoids, Hip Flexors, Quadriceps'
    },
    difficulty: 'Intermediate',
    startingPosition: 'Assume a strong high plank position with hands stacked directly below shoulders, fingers spread wide, legs straight, and feet hip-width apart.',
    stepByStepExecution: [
      'Step 1 (Plank Lock): Engage your core so your back is level. Squeeze shoulders away from ears.',
      'Step 2 (Knee Drive): Drive right knee forward toward chest without letting hips pike up into the air.',
      'Step 3 (Rapid Switch): Quickly touch ball of right foot to floor (or keep hovering) and switch legs in a continuous running motion.',
      'Step 4 (Plank Transition): At the end of the interval, immediately lock out into a rock-solid static plank for 20 seconds.'
    ],
    breathingCues: {
      inhale: 'Maintain continuous, rhythmic nasal breathing.',
      exhale: 'Exhale consistently to match your alternating leg drives.'
    },
    commonMistakes: [
      {
        mistake: 'Hips bouncing up and down or piking high in the air.',
        correction: 'Keep hips locked in a straight flat line parallel to the ground.'
      },
      {
        mistake: 'Shoulders drifting backward behind the wrist joints.',
        correction: 'Keep shoulders stacked directly vertically over wrist creases.'
      },
      {
        mistake: 'Looking down at feet and curving upper back.',
        correction: 'Gaze forward at hands to keep neck in alignment.'
      }
    ],
    homeModifications: {
      easier: 'Slow cross-body mountain climbers with hands elevated on a desk or chair.',
      harder: 'Double-tempo sprint cadence with knee-to-elbow rotational drive.'
    },
    postureChecks: [
      'Wrists directly under shoulders',
      'Hips stay flat like a tabletop',
      'Constant rhythmic pacing'
    ],
    recommendedRepsOrTime: '4 rounds of 40s work + 20s solid plank',
    medicalSafetyRule: 'Lumbar Anti-Extension and Wrist Compressive Management: Do not allow the hips to sag toward the floor during rapid leg cycling, as this shears the lumbar vertebrae. Keep hands elevated on a desk or bed if wrists ache.',
    injuryPrevention: {
      primaryRisk: 'Hyperextension of lower lumbar spine during fatigue.',
      preventionTechnique: 'Maintain constant serratus anterior push-through to prevent scapular winging.',
      anatomicalCue: 'Imagine pushing the floor 2 inches deeper away from you.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Gaze slightly ahead of hands; cervical spine neutral.',
      torsoAndSpine: 'Transverse core clamped; zero vertical hip oscillation.',
      pelvisAndHips: 'Hips maintain level height with shoulders.',
      limbsAndJoints: 'Wrists directly beneath shoulder joints; knees drive straight.'
    },
    contraindications: [
      'Acute wrist scaphoid or TFCC sprain',
      'Acute lumbar disc herniation with radicular pain'
    ]
  },

  // 11. Bird-Dog Spinal Stabilizer
  'bird-dog': {
    id: 'bird-dog',
    name: 'Bird-Dog Neutral Spine Stabilizer',
    category: 'Mobility',
    equipmentNeeded: 'Zero Equipment (Floor or carpet)',
    targetMuscles: {
      primary: 'Erector Spinae (Lower Back), Multifidus, Glutes',
      secondary: 'Shoulders, Core, Hamstrings'
    },
    difficulty: 'Beginner',
    startingPosition: 'Begin on hands and knees (quadruped position). Wrists directly under shoulders, knees directly under hips. Spine in neutral alignment like a flat table.',
    stepByStepExecution: [
      'Step 1 (Core Brace): Draw belly button gently toward spine without rounding your back.',
      'Step 2 (Reach): Inhale and slowly extend your right arm straight forward while simultaneously kicking your left leg straight back.',
      'Step 3 (Hold & Align): Raise limbs until parallel to the floor. Do not allow your lower back to arch or hips to tilt sideways. Hold for 2 seconds.',
      'Step 4 (Return & Alternate): Exhale and return hands and knees to the floor under control. Switch to the left arm and right leg.'
    ],
    breathingCues: {
      inhale: 'Inhale deeply as limbs reach outward.',
      exhale: 'Exhale with control as limbs return to quadruped position.'
    },
    commonMistakes: [
      {
        mistake: 'Lifting leg too high and arching lower back.',
        correction: 'Focus on reaching LONG towards the back wall, not high.'
      },
      {
        mistake: 'Pelvis tilting or rotating to one side.',
        correction: 'Imagine balancing a full cup of hot coffee on your lower back—keep hips completely level.'
      },
      {
        mistake: 'Shrugging shoulders into neck.',
        correction: 'Keep arm active and shoulder socket engaged.'
      }
    ],
    homeModifications: {
      easier: 'Extend only one limb at a time (just leg or just arm).',
      harder: 'Touch elbow to opposite knee under your torso between each extension before reaching back out.'
    },
    postureChecks: [
      'Flat back like a tabletop throughout',
      'Neck in line with spine',
      'Reaching long, not high'
    ],
    recommendedRepsOrTime: '3 sets of 10 reps per side with 2-second hold',
    medicalSafetyRule: 'Clinical Spine Rehabilitation: Designed by Dr. Stuart McGill to build muscular endurance in the lumbar multifidus and gluteus maximus without placing compressive load on the lumbar discs. Never hyperextend leg past parallel.',
    injuryPrevention: {
      primaryRisk: 'Rotational torque and hyperlordosis in lumbar vertebrae.',
      preventionTechnique: 'Maintain a 2-second hold at end range with hips strictly horizontal.',
      anatomicalCue: 'Reach thumb to the ceiling and push heel toward the back wall.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Gaze downward to floor; neck aligned with back.',
      torsoAndSpine: 'Flat like an ironing board; zero twisting.',
      pelvisAndHips: 'Both ASIS hip bones pointing directly down at the floor.',
      limbsAndJoints: 'Arm and leg parallel to floor; supporting knee directly under hip.'
    },
    contraindications: [
      'Severe knee osteoarthritis with intolerance to direct kneeling (use bed/soft pad)'
    ]
  },

  // 12. Flat Olympic Barbell Bench Press (Chest)
  'bench-press': {
    id: 'bench-press',
    name: 'Flat Olympic Barbell Bench Press',
    category: 'Upper Body',
    equipmentNeeded: 'Olympic Bench, 20kg Olympic Barbell & Weight Plates (Gym)',
    targetMuscles: {
      primary: 'Pectoralis Major (Sternal & Clavicular heads), Triceps Brachii',
      secondary: 'Anterior Deltoids, Serratus Anterior, Latissimus Dorsi (stabilizer)'
    },
    difficulty: 'Intermediate',
    startingPosition: 'Lie on bench with eyes directly beneath the racked barbell. Plant both feet flat and wide on the floor. Retract and depress shoulder blades into the bench pad, maintaining a natural lumbar arch. Grip the bar slightly wider than shoulder-width with thumbs wrapped securely.',
    stepByStepExecution: [
      'Step 1 (Unrack & Settle): Inhale, brace abs, and press bar off the j-hooks. Settle the bar directly over your upper chest with wrists stacked straight over elbows.',
      'Step 2 (Controlled Descent): Inhale deeply and lower the bar under strict control (2-3 seconds). Keep elbows tucked at 45-70 degrees from your torso in the scapular plane.',
      'Step 3 (Sternum Touch): Lightly touch the lower sternum (nipple line) for a brief 0.5-second pause without bouncing off ribs.',
      'Step 4 (Concentric Drive): Exhale and drive through your heels into the floor while pressing the bar in a slight backward diagonal arc back over the upper chest/shoulders.'
    ],
    breathingCues: {
      inhale: 'Deep diaphragmatic inhale and abdominal brace on the descent to support the chest cavity.',
      exhale: 'Exhale forcefully past the sticking point on the upward press.'
    },
    commonMistakes: [
      {
        mistake: 'Flaring elbows outward perpendicular at 90 degrees to the body.',
        correction: 'Tuck elbows to 45-70 degrees to protect the subacromial space and rotator cuffs.'
      },
      {
        mistake: 'Bouncing the heavy barbell off the ribcage.',
        correction: 'Lower with 2s eccentric control and touch lightly without momentum.'
      },
      {
        mistake: 'Lifting glutes or feet off the bench/floor.',
        correction: 'Maintain 5-point contact: Head, upper back, glutes, left foot, right foot.'
      }
    ],
    homeModifications: {
      easier: 'Plate-loaded chest press machine or flat dumbbell press with moderate weight.',
      harder: 'Paused 3-second deficit bench press or close-grip barbell press.'
    },
    postureChecks: [
      'Shoulder blades pinched together against the bench throughout the rep',
      'Wrists kept straight and not bent backward under the bar',
      'Bar path moves in a gentle diagonal arc toward the shoulders at lockout'
    ],
    recommendedRepsOrTime: '4 sets of 8-12 repetitions',
    medicalSafetyRule: 'Subacromial Impingement Prevention: Retract and depress your scapulae prior to unracking. Flaring elbows at 90° pinches the supraspinatus tendon. Never use a thumbless suicide grip.',
    injuryPrevention: {
      primaryRisk: 'Pectoral tear and anterior shoulder capsule laxity at bottom depth.',
      preventionTechnique: 'Warm up rotator cuffs with face pulls; maintain solid scapular tuck on pad.',
      anatomicalCue: 'Think about bending the bar in half to engage lats and lock external shoulder rotation.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Resting flat on the pad with chin slightly tucked, never hyperextending.',
      torsoAndSpine: 'Shoulder blades pinched together into pad; modest natural lumbar arch; ribs down.',
      pelvisAndHips: 'Glutes remain firmly glued to the bench throughout every single repetition.',
      limbsAndJoints: 'Feet flat on floor driving backward; elbows tucked at 45-70°; straight wrists.'
    },
    contraindications: [
      'Active acromioclavicular (AC) joint sprain or acute rotator cuff tendinitis'
    ]
  },

  // 13. Wide-Grip Lat Pulldown Machine (Back)
  'lat-pulldown': {
    id: 'lat-pulldown',
    name: 'Wide-Grip Lat Pulldown Machine',
    category: 'Upper Body',
    equipmentNeeded: 'Cable Lat Pulldown Station & Wide Bar (Gym)',
    targetMuscles: {
      primary: 'Latissimus Dorsi, Teres Major, Rhomboids',
      secondary: 'Biceps Brachii, Posterior Deltoid, Lower Trapezius'
    },
    difficulty: 'Beginner',
    startingPosition: 'Adjust thigh pad so legs are locked firmly in place with feet flat on the floor. Take an overhand grip slightly wider than shoulder-width. Sit tall with chest lifted and shoulders down.',
    stepByStepExecution: [
      'Step 1 (Scapular Initiation): Inhale and pull shoulder blades down and back before bending your elbows.',
      'Step 2 (The Pull): Exhale and pull the bar smoothly down to upper collarbone level. Drive elbows down and back toward your back pockets.',
      'Step 3 (Peak Squeeze): Hold the bar at chest level for 1 full second, squeezing your armpits and middle back.',
      'Step 4 (Controlled Return): Inhale and slowly resist the weight stack as it rises for 3 seconds until arms are fully extended and lats are deeply stretched.'
    ],
    breathingCues: {
      inhale: 'Inhale on the upward return phase as the back muscles stretch under load.',
      exhale: 'Exhale smoothly as you pull the bar down toward your clavicle.'
    },
    commonMistakes: [
      {
        mistake: 'Pulling the bar behind the neck.',
        correction: 'Always pull to the front of your chest to avoid dangerous cervical spine and shoulder damage.'
      },
      {
        mistake: 'Leaning back excessively past 20 degrees and turning it into a row.',
        correction: 'Keep torso nearly upright with just a slight 10-15° backward lean.'
      }
    ],
    homeModifications: {
      easier: 'Neutral-grip close handle attachment with moderate resistance.',
      harder: 'Full dead-hang pull-ups or 4-second eccentric tempo.'
    },
    postureChecks: [
      'Chest high with sternum pointing toward the pulley',
      'Elbows tracking directly downwards, not flared backward',
      'Smooth control on the ascent with full lat extension'
    ],
    recommendedRepsOrTime: '4 sets of 10-12 repetitions',
    medicalSafetyRule: 'Cervical & Brachial Plexus Protection: Never pull behind the neck. Pulling behind forces extreme cervical spine forward head flexion and excessive shoulder external rotation under compressive load.',
    injuryPrevention: {
      primaryRisk: 'Biceps tendon strain and swinging momentum lumbar strain.',
      preventionTechnique: 'Initiate with lat depression rather than forearm curling.',
      anatomicalCue: 'Imagine driving your elbows directly into your jeans back pockets.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Neutral cervical spine; looking slightly upward at the cable pulley.',
      torsoAndSpine: 'Proud chest with slight 15° backward lean; lumbar spine locked stable.',
      pelvisAndHips: 'Thighs wedged securely beneath the cushioned pads with hips grounded.',
      limbsAndJoints: 'Overhand wide grip; elbows pull vertically downwards.'
    },
    contraindications: [
      'Acute distal biceps tendinopathy or unhealed shoulder subluxation'
    ]
  },

  // 14. Standing Olympic / EZ-Bar Bicep Curls (Biceps)
  'bicep-curl': {
    id: 'bicep-curl',
    name: 'Standing Olympic / EZ-Bar Bicep Curls',
    category: 'Upper Body',
    equipmentNeeded: 'EZ-Curl Bar or Olympic Barbell (Gym)',
    targetMuscles: {
      primary: 'Biceps Brachii (Long and Short Heads)',
      secondary: 'Brachialis, Brachioradialis, Forearm Flexors'
    },
    difficulty: 'Intermediate',
    startingPosition: 'Stand tall with feet shoulder-width apart. Hold the cambered EZ-bar with an underhand grip shoulder-width apart. Pin your elbows directly to the sides of your ribcage with shoulders depressed.',
    stepByStepExecution: [
      'Step 1 (Setup & Brace): Squeeze glutes, brace abs, and ensure wrists are locked rigid and straight.',
      'Step 2 (Concentric Curl): Exhale and curl the bar upward by flexing at the elbow joint only. Keep upper arms completely stationary.',
      'Step 3 (Peak Contraction): Curl until the bar is near chest height. Squeeze your biceps forcefully for 1 full second.',
      'Step 4 (Slow Eccentric): Inhale and lower the bar under strict tension for 2.5 seconds until arms are nearly straight.'
    ],
    breathingCues: {
      inhale: 'Inhale through the nose on the lowering phase as the bicep lengthens.',
      exhale: 'Exhale through pursed lips as you curl the weight upward.'
    },
    commonMistakes: [
      {
        mistake: 'Swinging the torso backward to cheat the weight up.',
        correction: 'Stand against a flat wall or lower the weight by 20% to keep strict elbow isolation.'
      },
      {
        mistake: 'Allowing elbows to drift forward or flare out.',
        correction: 'Lock elbows into your obliques throughout the full range of motion.'
      }
    ],
    homeModifications: {
      easier: 'Seated incline dumbbell curls or cable curls.',
      harder: '21s workout (7 lower half, 7 upper half, 7 full reps).'
    },
    postureChecks: [
      'Upper arms locked vertical and glued to the ribcage',
      'Neutral wrists aligned with the forearms without backward bending',
      'Zero lower-back extension or momentum swinging'
    ],
    recommendedRepsOrTime: '3 sets of 10-12 repetitions',
    medicalSafetyRule: 'Carpal Tunnel & Distal Tendon Protection: Use an EZ-curl bar instead of a straight bar if you experience wrist or inner forearm soreness. The angled grip eliminates excessive wrist supination torque.',
    injuryPrevention: {
      primaryRisk: 'Lumbar hyperextension swinging and distal biceps tendon strain.',
      preventionTechnique: 'Bend knees slightly, squeeze glutes, and keep reps smooth without jerking.',
      anatomicalCue: 'Pin your elbows like door hinges that only pivot open and shut.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Neutral cervical spine, looking straight ahead.',
      torsoAndSpine: 'Upright torso; core tightly braced; shoulders depressed.',
      pelvisAndHips: 'Pelvis in neutral alignment with glutes engaged to prevent sway.',
      limbsAndJoints: 'Elbows glued to flanks; wrists straight; knees soft.'
    },
    contraindications: [
      'Acute medial epicondylitis (golfer\'s elbow) or distal biceps strain'
    ]
  },

  // 15. Triceps Cable Rope Pushdowns (Triceps)
  'tricep-pushdown': {
    id: 'tricep-pushdown',
    name: 'Triceps Cable Rope Pushdowns',
    category: 'Upper Body',
    equipmentNeeded: 'High Cable Pulley & Rope Attachment (Gym)',
    targetMuscles: {
      primary: 'Triceps Brachii (Lateral, Medial, and Long Heads)',
      secondary: 'Anconeus, Forearm Extensors'
    },
    difficulty: 'Beginner',
    startingPosition: 'Face the cable station. Grip the rope near the rubber stoppers with palms facing each other. Hinge forward slightly at the hips (10°), keep chest up, and tuck elbows tight to your sides.',
    stepByStepExecution: [
      'Step 1 (Starting Tension): Position forearms slightly above parallel with the floor, feeling the triceps stretch.',
      'Step 2 (The Pushdown): Exhale and push the rope down by extending the elbows until arms are fully straight.',
      'Step 3 (Outward Flare): At the bottom, pull the rope ends outward away from each other and squeeze triceps hard for 1 second.',
      'Step 4 (Controlled Ascent): Inhale and slowly let forearms rise back to the starting angle over 2 seconds while keeping elbows pinned.'
    ],
    breathingCues: {
      inhale: 'Inhale smoothly as forearms return upward.',
      exhale: 'Exhale with power as you push down and flare the rope.'
    },
    commonMistakes: [
      {
        mistake: 'Letting elbows flare outward away from the body.',
        correction: 'Anchor your elbows like pins into your flanks throughout the movement.'
      },
      {
        mistake: 'Using whole-body weight to press down on the rope.',
        correction: 'Stand solid with a hip hinge; isolate the elbow joint exclusively.'
      }
    ],
    homeModifications: {
      easier: 'Straight bar attachment or lighter resistance on cable stack.',
      harder: 'Overhead cable extension or drop set on final set.'
    },
    postureChecks: [
      'Elbows stay stationary at the sides of the torso',
      'Shoulders relaxed and depressed down, not shrugging upward',
      'Full tricep contraction with rope flare at bottom'
    ],
    recommendedRepsOrTime: '4 sets of 12-15 repetitions',
    medicalSafetyRule: 'Olecranon Bursa Protection: Keep the movement smooth without snapping into hyperextended elbow lockout. Stop with a soft 1-degree micro-bend to protect the olecranon cartilage.',
    injuryPrevention: {
      primaryRisk: 'Triceps tendinitis from excessive elbow swinging.',
      preventionTechnique: 'Keep upper arm completely still; isolate the tricep hinge.',
      anatomicalCue: 'Spread the rope ends apart at the bottom to lock out the lateral head.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Neutral neck in line with the slight hip-hinged torso.',
      torsoAndSpine: '10° forward hip hinge with flat spine and engaged core.',
      pelvisAndHips: 'Hips hinged back slightly with feet hip-width for balance.',
      limbsAndJoints: 'Elbows anchored at sides; wrists firm; flare rope at bottom.'
    },
    contraindications: [
      'Active triceps tendon inflammation or elbow olecranon bursitis'
    ]
  },

  // 16. 45-Degree Incline Leg Press Machine (Legs)
  'leg-press': {
    id: 'leg-press',
    name: '45-Degree Incline Leg Press Machine',
    category: 'Lower Body',
    equipmentNeeded: 'Plate-Loaded 45-Degree Leg Press Machine (Gym)',
    targetMuscles: {
      primary: 'Quadriceps (Rectus Femoris, Vastus Lateralis/Medialis), Gluteus Maximus',
      secondary: 'Hamstrings, Adductors, Calves'
    },
    difficulty: 'Intermediate',
    startingPosition: 'Sit in the machine with your back and hips pressed completely flat against the support pads. Place feet shoulder-width apart in the center of the sled platform, toes pointed slightly outward (10-15°). Disengage the safety pins.',
    stepByStepExecution: [
      'Step 1 (Descent): Inhale deeply, brace your abs, and lower the sled under control until knees bend to approximately 90 degrees.',
      'Step 2 (Safety Check): Ensure your lower back and tailbone stay glued to the seat pad. Do not allow your pelvis to curl upward.',
      'Step 3 (Drive): Exhale and drive through your midfoot and heels to push the sled back up.',
      'Step 4 (Lockout): Stop just short of locking your knees. Keep a soft micro-bend in the knees at the top to preserve joint cartilage.'
    ],
    breathingCues: {
      inhale: 'Inhale deeply as the sled descends toward your chest.',
      exhale: 'Exhale forcefully as you press the sled platform upward.'
    },
    commonMistakes: [
      {
        mistake: 'Locking knees completely out and hyperextending joints at the top.',
        correction: 'Always keep a soft micro-bend at the apex to keep tension on quads, not joints.'
      },
      {
        mistake: 'Allowing the lower back or glutes to lift off the seat pad ("butt wink").',
        correction: 'Limit depth to where your lower back remains firmly against the pad.'
      }
    ],
    homeModifications: {
      easier: 'Bodyweight squats or dumbbell goblet squats.',
      harder: 'Single-leg press or slow 4-second eccentric tempo.'
    },
    postureChecks: [
      'Lower back and sacrum firmly pinned against the seat at all times',
      'Knees track outward in line with the second toe without caving in',
      'Feet stay flat on the platform without heels lifting'
    ],
    recommendedRepsOrTime: '4 sets of 10-15 repetitions',
    medicalSafetyRule: 'Lumbar Herniation & Patellar Safety: Never allow your lower back or pelvis to roll forward off the seat pad (posterior pelvic tilt under load creates extreme lumbar disc shear). Never lock knees out violently.',
    injuryPrevention: {
      primaryRisk: 'Patellar tendon shearing and L4-L5 disc compression.',
      preventionTechnique: 'Keep safety stopper pegs set at proper depth; drive through whole foot.',
      anatomicalCue: 'Push through your heels and keep your tailbone cemented into the pad.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Resting comfortably on the back pad, chin neutral.',
      torsoAndSpine: 'Entire spine supported flat on the pads; zero gap behind lumbar.',
      pelvisAndHips: 'Pelvis anchored deep into the seat junction.',
      limbsAndJoints: 'Feet flat; knees track toes; soft bend at top lockout.'
    },
    contraindications: [
      'Acute lumbar disc herniation with flexion intolerance or severe patellar chondromalacia'
    ]
  }
};

// Fallback helper to find guide by name match
export function getExerciseGuideByName(name: string): ExerciseStepGuide {
  const normalized = name.toLowerCase();

  // Gym guides matches
  if (normalized.includes('bench press') || normalized.includes('chest press') || normalized.includes('flyes') || normalized.includes('crossover')) {
    return EXERCISE_STEP_GUIDES['bench-press'];
  }
  if (normalized.includes('lat pulldown') || normalized.includes('pulldown') || (normalized.includes('row') && normalized.includes('cable'))) {
    return EXERCISE_STEP_GUIDES['lat-pulldown'];
  }
  if (normalized.includes('bicep') || normalized.includes('curl') || normalized.includes('ez-bar') || normalized.includes('hammer curl')) {
    return EXERCISE_STEP_GUIDES['bicep-curl'];
  }
  if (normalized.includes('pushdown') || normalized.includes('skull crusher') || normalized.includes('tricep') || normalized.includes('extension')) {
    return EXERCISE_STEP_GUIDES['tricep-pushdown'];
  }
  if (normalized.includes('leg press') || (normalized.includes('squat') && normalized.includes('barbell')) || normalized.includes('hamstring') || normalized.includes('leg extension')) {
    return EXERCISE_STEP_GUIDES['leg-press'];
  }

  // Home & Bodyweight guides matches
  if (normalized.includes('push-up') || normalized.includes('push up')) {
    return EXERCISE_STEP_GUIDES['push-ups'];
  }
  if (normalized.includes('squat') || normalized.includes('chair tap')) {
    return EXERCISE_STEP_GUIDES['air-squats'];
  }
  if (normalized.includes('row') || normalized.includes('doorframe') || normalized.includes('towel')) {
    return EXERCISE_STEP_GUIDES['doorframe-rows'];
  }
  if (normalized.includes('lunge') || normalized.includes('split squat')) {
    return EXERCISE_STEP_GUIDES['walking-lunges'];
  }
  if (normalized.includes('deadbug') || normalized.includes('hollow') || normalized.includes('plank')) {
    return EXERCISE_STEP_GUIDES['deadbug-core'];
  }
  if (normalized.includes('wall sit') || normalized.includes('calf')) {
    return EXERCISE_STEP_GUIDES['wall-sit'];
  }
  if (normalized.includes('bridge') || normalized.includes('glute')) {
    return EXERCISE_STEP_GUIDES['glute-bridges'];
  }
  if (normalized.includes('dip') || normalized.includes('tricep')) {
    return EXERCISE_STEP_GUIDES['chair-dips'];
  }
  if (normalized.includes('high-knee') || normalized.includes('cadence') || normalized.includes('sprint')) {
    return EXERCISE_STEP_GUIDES['high-knees'];
  }
  if (normalized.includes('climber') || normalized.includes('mountain')) {
    return EXERCISE_STEP_GUIDES['mountain-climbers'];
  }
  if (normalized.includes('bird-dog') || normalized.includes('spine') || normalized.includes('cat-cow')) {
    return EXERCISE_STEP_GUIDES['bird-dog'];
  }

  // Generic fallback guide with safety rules
  return {
    id: 'generic-exercise',
    name: name,
    category: 'Full Body / Cardio',
    equipmentNeeded: 'Zero Equipment (Bodyweight / Floor space)',
    targetMuscles: {
      primary: 'Core & Functional Muscle Groups',
      secondary: 'Stabilizers, Cardiovascular Endurance'
    },
    difficulty: 'Beginner',
    startingPosition: 'Establish an athletic stance with feet hip-width apart, spine aligned, and core muscles engaged.',
    stepByStepExecution: [
      'Step 1 (Setup & Posture): Stand tall or set up on the floor with a neutral spine. Inhale and brace your core.',
      'Step 2 (Movement Initiation): Begin the exercise under controlled tempo (2 seconds eccentric phase).',
      'Step 3 (Apex Contraction): Squeeze target muscles firmly at the point of maximum tension for 1 second.',
      'Step 4 (Return to Start): Exhale with power and return smoothly to the starting position.'
    ],
    breathingCues: {
      inhale: 'Inhale through nose on the lengthening / lowering phase.',
      exhale: 'Exhale through mouth on the exerting / pressing / lifting phase.'
    },
    commonMistakes: [
      {
        mistake: 'Moving too fast and utilizing momentum instead of muscle fiber tension.',
        correction: 'Slow down each rep to a strict 2-1-2 tempo (2s down, 1s hold, 2s up).'
      },
      {
        mistake: 'Holding your breath under exertion.',
        correction: 'Keep breathing continuously with rhythmic inhales and exhales.'
      },
      {
        mistake: 'Losing core abdominal brace during late reps.',
        correction: 'Re-tighten abs and reset posture before each rep.'
      }
    ],
    homeModifications: {
      easier: 'Reduce range of motion or perform with hands resting on a sturdy chair for balance.',
      harder: 'Add a 3-second pause at the most difficult part of the movement.'
    },
    postureChecks: [
      'Neutral cervical and lumbar spine',
      'Smooth joint range of motion',
      'Target muscle active connection'
    ],
    recommendedRepsOrTime: '3 sets of 10-15 controlled repetitions',
    medicalSafetyRule: 'Dynamic Spinal Alignment & Joint Protection: Maintain a neutral spine curve throughout all reps. Avoid sudden jerking movements and discontinue if sharp joint impingement occurs.',
    injuryPrevention: {
      primaryRisk: 'Form breakdown due to muscular fatigue in stabilizing musculature.',
      preventionTechnique: 'Prioritize posture and movement quality over speed or total rep count.',
      anatomicalCue: 'Keep core packed and breath flowing freely without Valsalva pressure.'
    },
    correctPostureChecklist: {
      headAndNeck: 'Cervical spine aligned with torso.',
      torsoAndSpine: 'Transverse core engaged; neutral lumbar spine.',
      pelvisAndHips: 'Pelvis balanced without lateral tilting.',
      limbsAndJoints: 'Joints track in natural anatomical planes without hyperextension.'
    },
    contraindications: [
      'Acute joint inflammation or unhealed musculoskeletal injury'
    ]
  };
}
