document.addEventListener("DOMContentLoaded", () => {
  // --- Part 1: Renewable Survey Logic ---
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  document.getElementById("survey-cycle-info").innerText = `Current Cycle: ${currentMonth} Feedback Window`;

  const surveyForm = document.getElementById("feedback-form");
  const surveyStatus = document.getElementById("survey-status");

  surveyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("member-name").value || "Anonymous";
    const rating = document.getElementById("event-rating").value;
    const comments = document.getElementById("survey-comments").value;

    const feedbackEntry = {
      timestamp: new Date().toISOString(),
      cycle: currentMonth,
      name,
      rating,
      comments
    };

    // Save to local storage for persistence
    const storedFeedback = JSON.parse(localStorage.getItem("club_feedbacks") || "[]");
    storedFeedback.push(feedbackEntry);
    localStorage.setItem("club_feedbacks", JSON.stringify(storedFeedback));

    surveyStatus.style.color = "#16a34a";
    surveyStatus.innerText = "✓ Thank you! Your feedback for this cycle has been submitted.";
    surveyForm.reset();
  });

  // --- Part 2: Individual Complaint Submission ---
  const complaintForm = document.getElementById("complaint-form");
  const complaintStatus = document.getElementById("complaint-status");

  complaintForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const category = document.getElementById("complaint-category").value;
    const subject = document.getElementById("complaint-subject").value;
    const details = document.getElementById("complaint-details").value;
    const ticketId = "TKT-" + Math.floor(100000 + Math.random() * 900000);

    const complaintEntry = {
      ticketId,
      timestamp: new Date().toISOString(),
      category,
      subject,
      details
    };

    // Store securely in localStorage (or send to backend API)
    const storedComplaints = JSON.parse(localStorage.getItem("club_complaints") || "[]");
    storedComplaints.push(complaintEntry);
    localStorage.setItem("club_complaints", JSON.stringify(storedComplaints));

    complaintStatus.style.color = "#16a34a";
    complaintStatus.innerText = `✓ Complaint filed privately. Your reference ID is ${ticketId}.`;
    complaintForm.reset();
  });

  // --- Part 3: Knowledge-Based AI Assistant ---
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatWindow = document.getElementById("chat-window");

  // Knowledge base for common inquiries
  const responses = [
    { keywords: ["hi ", "hello", "how are you", "hey"], reply: "Feeling Great! How are you ? How can I help you today ?" },
    { keywords: ["time", "meeting", "when", "schedule"], reply: "General club meetings take place every Tuesday at 6:30 PM in Room 204." },
    { keywords: ["fee", "dues", "cost", "pay"], reply: "Annual membership dues are $25, payable at the start of each semester via the board treasurer." },
    { keywords: ["join", "membership", "sign up"], reply: "New members can join anytime by attending a Sunday meeting or submitting a request via the board contact." },
    { keywords: ["complaint", "issue", "report"], reply: "You can file private grievances directly in Section 2 above; only authorized board members review them." },
    { keywords: ["survey", "feedback"], reply: "Our feedback survey is renewed monthly in Section 1 to guide future event planning." },
    { keywords: ["thanks", "thank you", "glad", "greatfull"], reply: "You're very welcome all the time.When you need anything I am always here." }
  ];

  function getBotResponse(input) {
    const cleanInput = input.toLowerCase();
    for (const entry of responses) {
      if (entry.keywords.some(k => cleanInput.includes(k))) {
        return entry.reply;
      }
    }
    return "I'm not sure about that specific detail yet. Please reach out directly to the executive board or file a ticket in the complaints section!";
  }

  function appendMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", sender);
    bubble.innerText = text;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    appendMessage(query, "user");
    chatInput.value = "";

    setTimeout(() => {
      const botReply = getBotResponse(query);
      appendMessage(botReply, "bot");
    }, 400);
  });
});
