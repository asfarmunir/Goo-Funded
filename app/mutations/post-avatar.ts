export const postAvatar = async (image: File) => {
    const formData = new FormData();
    formData.append('file', image);
    
    const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
    });
    
    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        console.error('Failed to upload the file');
        throw new Error('Failed to upload the file');
    }
}