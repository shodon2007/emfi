export const waitHandler = async (ms) => {
    const waitPromise = new Promise((res) => setTimeout(res, ms));
    await waitPromise;
}
