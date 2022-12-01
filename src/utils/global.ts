export const setGlobalData = (data: Record<string, any>) => {
  getApp().global = {
    ...getApp().global,
    ...data,
  }
};

export const getGlobalData = (key: string) => {
  return getApp().global[key];
}