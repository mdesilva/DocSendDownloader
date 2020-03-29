let startTime;
const doc = new PDFDocument({layout:'landscape', margin: 0, autoFirstPage: false});
const stream = doc.pipe(blobStream());

const getImageAsBlob = async (url) => 
    await fetch("https://cors-anywhere.herokuapp.com/" + url)
    .then((response) =>{
        return response.blob();
    })
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
}));

const addSlidesToPDF = async (imageUrls) =>{
    for (let i=0; i<imageUrls.length; i++) {
        await getImageAsBlob(imageUrls[i]).then(data => {
            const img = doc.openImage(data);
            doc.addPage({size: [img.width, img.height]});
            doc.image(img, 0, 0);
        
        })    
    }
}

const buildPdf = async (imageUrls) => {
    startTime = new Date().getTime();
    await addSlidesToPDF(imageUrls);
    doc.end();
}

stream.on("finish", () => {
    slideDeckGenerationInProgress = false;
    let blobUrl = stream.toBlobURL('application/pdf');
    let totalTime = new Date().getTime() - startTime;
    initiateDownload(blobUrl);
    hideCustomAlert();
    showDefaultAlert("Done ! Slide deck PDF generated in " + String(totalTime) + " ms.");
})




