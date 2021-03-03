export const helper = {
  escapeRegExp(inputStr) {
    if (inputStr) {
      return inputStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    return inputStr;
  }
};
