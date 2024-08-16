export default function uniqueId () {
    const prefix = 'madnicabs';
    const length = 30;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const timestamp = Date.now().toString(36);
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    const id = prefix+timestamp+result
    return id
}