let startTime;
let numSlidesComplete = 0;
const doc = new PDFDocument({layout:'landscape', margin: 0, autoFirstPage: false});
const stream = doc.pipe(blobStream());

const getImageAsBlob = async (url) => 
    await fetch(url, {mode: 'no-cors'})
    .then((response) =>{
        console.log(url, "url")
        console.log(response, "response")
        numSlidesComplete++;
        showCustomAlert(`Generating slide deck as PDF: ${numSlidesComplete}/${numSlides} slides complete...`);
        return response.blob();
    })
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    }))
    .catch((e) => {
        console.error("Error fetching slide deck images.")
    })

    const addSlidesToPDF = async (imageUrls) => {
        console.log(imageUrls, "imageUrls");
        const imagePromises = imageUrls.map(async (imageUrl) => {
            const data = await getImageAsBlob(imageUrl);
            console.log(data, "data");
            const img = doc.openImage(data);
            console.log(img.width, img.height, img);
            return { width: img.width, height: img.height, img };
        });
    
        const images = await Promise.all(imagePromises);
    
        images.forEach(({ width, height, img }) => {
            doc.addPage({ size: [width, height] });
            doc.image(img, 0, 0);
        });
    };
    

const buildPdf = async (imageUrls) => {
    startTime = new Date().getTime();
    await addSlidesToPDF(imageUrls);
    doc.end();
}