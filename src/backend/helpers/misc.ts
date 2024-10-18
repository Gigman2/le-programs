
export const isStringifiedObject = (data: string): boolean => {
    try {
        const parsedData = JSON.parse(data)
        return typeof parsedData === 'object' && parsedData != null
    } catch (error) {
        return false
    }
}

export const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}


