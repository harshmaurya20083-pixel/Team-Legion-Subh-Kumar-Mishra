import type { DiscoveryEvent } from "./types";

// Entirely illustrative fixtures, including organizers, campuses and schedules.
// No fabricated official or registration URLs. No real event is claimed.
const base = {
  organizerDescription: "An illustrative student-led organizer, not a real hosting organization.",
  sourceName: "MyWorld sample dataset",
  updatedAt: "2026-10-24",
  status: "published" as const,
  reviewStatus: "approved" as const,
  isSample: true,
  endDate: "2026-11-01",
  skillsDetails: "These are sample participation requirements, not an assessment of your ability.",
};

export const events: DiscoveryEvent[] = [
  {
    ...base, id: "event-austin-build", title: "Campus Build Weekend", category: "Hackathons", format: "Offline",
    description: "A two-day student hackathon to turn a small web development idea into a working prototype. Join a team, build together and share a short demo with fellow students. This is an illustrative event, not a real booking.",
    city: "Austin", campus: "Sample Austin Campus", venue: "Innovation Lab · sample venue", date: "2026-11-07", endDate: "2026-11-08", timeZone: "America/Chicago",
    registrationDeadline: "2026-11-04", organizer: "Campus Hackathon Teams", communityId: "c2",
    schedule: [{ time: "Nov 7 · 09:00", activity: "Welcome and team formation" }, { time: "Nov 7 · 10:00", activity: "Project building and mentoring" }, { time: "Nov 8 · 14:00", activity: "Project demos" }, { time: "Nov 8 · 16:00", activity: "Closing session" }],
    eligibility: ["College students", "Beginners welcome"], eligibilityDetails: "Open to currently enrolled college students. First-time hackathon participants are welcome; teams of two to four in this sample format.",
    skills: ["JavaScript", "Web development"], skillsDetails: "Basic familiarity with HTML and JavaScript is suggested; no prior hackathon experience is required in this sample event.", tags: ["prototype", "teams", "web development"],
  },
  {
    ...base, id: "event-virtual-react", title: "React: Your First Interactive App", category: "Workshops", format: "Online",
    description: "Build an interactive app step by step, covering components, state and accessible forms. Bring a small project idea and leave with a practice plan. Sample workshop only.",
    city: "Virtual", campus: "Online", venue: "Online workshop", onlineDetails: "An access link would be shared by the organizer after registration. No meeting link is available for this sample.", date: "2026-10-31", endDate: "2026-10-31", timeZone: "UTC",
    registrationDeadline: "2026-10-29", organizer: "Frontend Learners Circle", communityId: "c1",
    schedule: [{ time: "14:00", activity: "Components and state" }, { time: "15:00", activity: "Guided app-building practice" }, { time: "16:00", activity: "Questions and next steps" }],
    eligibility: ["Open to everyone", "Beginners welcome"], eligibilityDetails: "Open to all learners. No college enrollment requirement in this sample workshop.", skills: ["React", "JavaScript"], skillsDetails: "Basic JavaScript familiarity is suggested. React experience is not required.", tags: ["web development", "react", "accessible forms"],
  },
  {
    ...base, id: "event-seattle-design", title: "Design & Coffee: Student Meetup", category: "Meetups", format: "Offline",
    description: "A relaxed student meetup for sharing design projects, exchanging feedback and meeting people working on creative ideas. Sample event; the venue and gathering are illustrative.",
    city: "Seattle", campus: "Sample Seattle Campus", venue: "Student Commons · sample venue", date: "2026-11-03", endDate: "2026-11-03", timeZone: "America/Los_Angeles",
    registrationDeadline: "2026-11-02", organizer: "Student Design Circle",
    schedule: [{ time: "17:00", activity: "Introductions" }, { time: "17:30", activity: "Project sharing and feedback" }, { time: "19:00", activity: "Wrap-up" }],
    eligibility: ["College students", "Beginners welcome"], eligibilityDetails: "For students interested in design. A portfolio is optional; this sample meetup welcomes first-time participants.", skills: ["Design"], skillsDetails: "No required prior skills; bring curiosity and optionally a project to discuss.", tags: ["design", "feedback", "networking"],
  },
  {
    ...base, id: "event-boston-research", title: "Student Research & Technology Forum", category: "Conferences", format: "Hybrid",
    description: "Student talks and panels about research, open-source technology and practical career paths. Attend the sample campus sessions or join the illustrative online track.",
    city: "Boston", campus: "Sample Boston Campus", venue: "Learning Auditorium · sample venue", onlineDetails: "A remote session track is planned in this sample schedule; no access link exists.", date: "2026-11-14", endDate: "2026-11-14", timeZone: "America/New_York",
    registrationDeadline: "2026-11-10", organizer: "Student Research Collective",
    schedule: [{ time: "09:30", activity: "Opening talks" }, { time: "11:00", activity: "Research and open-source panels" }, { time: "14:00", activity: "Student project presentations" }, { time: "16:00", activity: "Closing discussion" }],
    eligibility: ["Open to everyone"], eligibilityDetails: "Sample attendance is open to students and other interested learners. Presentation participation would require a separate organizer submission.", skills: ["Research", "Python"], skillsDetails: "No skills required for attending. Python and research are session topics, not eligibility barriers.", tags: ["research", "open source", "technology"],
  },
  {
    ...base, id: "event-austin-pitch", title: "Small Ideas, Big Possibilities", category: "Competitions", format: "Hybrid",
    description: "An illustrative student pitch competition for early project ideas. Practice explaining a problem, share your approach and receive peer feedback. No real prizes or selection claims are made.",
    city: "Austin", campus: "Sample Austin Campus", venue: "Project Studio · sample venue", onlineDetails: "Remote pitches would be supported; no live access link is available for this sample.", date: "2026-11-21", endDate: "2026-11-21", timeZone: "America/Chicago",
    registrationDeadline: "2026-11-15", organizer: "Student Founders Circle", communityId: "c4",
    schedule: [{ time: "10:00", activity: "Pitch preparation" }, { time: "11:00", activity: "Student pitches" }, { time: "13:00", activity: "Feedback and reflection" }],
    eligibility: ["College students"], eligibilityDetails: "Sample entrants must be college students with an early project idea. A working business or product is not required.", skills: ["Entrepreneurship", "Presentation"], skillsDetails: "Prepare a three-minute explanation of your idea. Prior business experience is not required.", tags: ["startup", "pitch", "projects"],
  },
  {
    ...base, id: "event-seattle-python", title: "Python for Everyday Data", category: "Workshops", format: "Offline",
    description: "A hands-on sample workshop about exploring a small dataset, cleaning records and creating a simple chart. Practice with classmates in a welcoming lab setting.",
    city: "Seattle", campus: "Sample Seattle Campus", venue: "Computing Lab · sample venue", date: "2026-11-06", endDate: "2026-11-06", timeZone: "America/Los_Angeles",
    registrationDeadline: "2026-11-05", organizer: "Campus Data Club",
    schedule: [{ time: "13:00", activity: "Python refresher" }, { time: "14:00", activity: "Data cleaning practice" }, { time: "15:30", activity: "Charts and discussion" }],
    eligibility: ["College students", "Beginners welcome"], eligibilityDetails: "For college students learning data skills; beginners are welcome in this illustrative workshop.", skills: ["Python", "Data analysis"], skillsDetails: "Bring a laptop. Basic Python syntax is helpful; no prior data analysis experience is expected.", tags: ["python", "data", "practice"],
  },
  {
    ...base, id: "event-boston-web", title: "Web Makers: Project Exchange", category: "Meetups", format: "Offline",
    description: "Share a web project, trade small code-review tips and find a practice partner. Sample community gathering with optional project demos.",
    city: "Boston", campus: "Sample Boston Campus", venue: "Student Project Room · sample venue", date: "2026-11-10", endDate: "2026-11-10", timeZone: "America/New_York",
    organizer: "Frontend Learners Circle", communityId: "c1", schedule: [{ time: "18:00", activity: "Introductions and project demos" }, { time: "19:00", activity: "Peer feedback" }, { time: "20:00", activity: "Closing" }],
    eligibility: ["Open to everyone", "Beginners welcome"], eligibilityDetails: "Anyone interested in web development can attend this sample meetup. Showing a project is optional.", skills: ["JavaScript", "Web development"], skillsDetails: "No required skills for attending. Topics include JavaScript and web development.", tags: ["web development", "code review", "community"],
  },
  {
    ...base, id: "event-virtual-accessibility", title: "Accessible Interfaces Challenge", category: "Competitions", format: "Online",
    description: "A sample collaborative challenge to improve the accessibility of a small interface. Explore keyboard navigation, labels and contrast, then present your changes.",
    city: "Virtual", campus: "Online", venue: "Online project room", onlineDetails: "This is an illustrative online challenge. No official meeting or registration link is supplied.", date: "2026-11-28", endDate: "2026-11-28", timeZone: "UTC",
    registrationDeadline: "2026-11-25", organizer: "Inclusive Web Collective", schedule: [{ time: "12:00", activity: "Challenge briefing" }, { time: "13:00", activity: "Interface improvement session" }, { time: "16:00", activity: "Demo and reflection" }],
    eligibility: ["Open to everyone"], eligibilityDetails: "Open to interested learners. Teams or individual participants are welcome in this sample challenge.", skills: ["Design", "Web development"], skillsDetails: "Basic HTML and CSS are suggested for code-based entries. Design-focused entries are also welcome.", tags: ["accessibility", "design", "web development"],
  },
];

export const EVENT_LOCATIONS = [...new Set(events.map((event) => event.city))].sort();
export const EVENT_CAMPUSES = [...new Set(events.map((event) => event.campus))].sort();
export const EVENT_SKILLS = [...new Set(events.flatMap((event) => event.skills))].sort();
export const EVENT_ELIGIBILITY = [...new Set(events.flatMap((event) => event.eligibility))].sort();