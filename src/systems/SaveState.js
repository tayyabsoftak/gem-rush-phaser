const STORAGE_KEY = 'gemRush_save';

const defaultState = {
  hasSeenInstructions: false,
};

export class SaveState {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      return { ...defaultState, ...JSON.parse(raw) };
    } catch {
      return { ...defaultState };
    }
  }

  static save(partial) {
    try {
      const current = SaveState.load();
      const next = { ...current, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    } catch {
      return { ...defaultState, ...partial };
    }
  }

  static markInstructionsSeen() {
    return SaveState.save({ hasSeenInstructions: true });
  }

  static resetInstructions() {
    return SaveState.save({ hasSeenInstructions: false });
  }
}
