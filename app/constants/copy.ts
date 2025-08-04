// Vici Copy Constants
// Consistent, conversational copy that doesn't feel AI-generated

export const errorMessages = {
  required: "This can't be blank, friend",
  tooLong: (max: number) => `Whoa, that's a novel. Keep it under ${max} characters`,
  network: "Internet's being weird. Give it another shot?",
  unauthorized: "You're not supposed to be here 👀",
  notFound: "We looked everywhere. Couldn't find that one.",
  taskCreateFailed: "Hmm, that didn't work. Try again?",
  taskUpdateFailed: "Couldn't update that. Give it another shot?",
  taskDeleteFailed: "Couldn't delete that. Maybe try again?",
  loadFailed: "Something went wrong loading your stuff. Refresh?"
}

export const successMessages = {
  taskCreated: "Added to your conquest list",
  taskUpdated: "Nice, updated that for you",
  taskCompleted: "Crushed it! 🏆",
  taskDeleted: "Gone! One less thing to worry about",
  settingsSaved: "All set. Back to conquering?",
  dataSaved: "Saved. You're good to go."
}

export const emptyStates = {
  tasks: {
    title: "Your conquest list is empty",
    description: "Ready to add something?",
    cta: "Add your first task"
  },
  insights: {
    title: "Insights incoming",
    description: "Complete a few tasks and I'll show you some patterns",
    cta: null
  },
  search: {
    title: "Nothing found",
    description: "Try a different search term?",
    cta: null
  }
}

export const ctaVariations = {
  primary: ["Get Vici", "Start conquering", "Claim victory", "Let's go"],
  secondary: ["See how it works", "Why Vici?", "Show me more"],
  tertiary: ["Maybe later", "Not convinced yet?", "I'll pass"]
}

export const formLabels = {
  taskInput: "What needs conquering?",
  timeEstimate: "How long?",
  priority: {
    low: "Can wait",
    medium: "Pretty important", 
    high: "Do this now"
  },
  category: {
    work: "Work stuff",
    personal: "Life admin",
    health: "Taking care of me",
    learning: "Getting smarter"
  }
}

export const buttonText = {
  submit: ["Let's go", "Make it happen", "Do it"],
  cancel: ["Never mind", "Actually, no", "Forget it"],
  delete: ["Yep, delete it", "Get rid of it", "Remove it"],
  save: ["Save this", "Looking good", "All set"]
}

export const placeholderText = {
  search: "Find something...",
  taskName: "e.g., Finish the quarterly report",
  timeEstimate: "How long? (be honest)",
  notes: "Any extra details?"
}

export const loadingMessages = {
  default: "Getting your stuff ready...",
  tasks: "Loading your conquest list...",
  insights: "Analyzing your patterns...",
  saving: "Saving this..."
}

export const confirmationMessages = {
  deleteTask: "Really delete this? (You can't undo it)",
  clearAll: "Delete everything? This can't be undone.",
  resetData: "Start over? All your data will be gone."
}
