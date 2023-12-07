let startTime;
let numSlidesComplete = 0;
const doc = new PDFDocument({layout:'landscape', margin: 0, autoFirstPage: false});
const stream = doc.pipe(blobStream());

function fetchResource(input, init) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({input, init}, messageResponse => {
        const [response, error] = messageResponse;
        console.log(response, "response in fetchResource")
        if (response === null) {
          reject(error);
        } else {
          // Use undefined on a 204 - No Content
          const body = response.body ? new Blob([response.body]) : undefined;
          resolve(new Response(body, {
            status: response.status,
            statusText: response.statusText,
          }));
        }
      });
    });
  }

const getImageAsBlob = async (url) => 
    await fetchResource(url)
    .then((response) =>{
        console.log(response, "getImageAsBlob response")
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

    const addSlidesToPDF = async (imageUrls) =>{
        console.log(imageUrls, "imageUrls")
        for (let i=0; i<imageUrls.length; i++) {
            await getImageAsBlob(imageUrls[i]).then(data => {
                console.log(imageUrls[i], "imageUrls[i]")
                console.log(data, "data in addSlidesToPDF")
                const img = doc.openImage(data);
                console.log(img.width, img.height, img);
                doc.addPage({size: [img.width, img.height]});
                doc.image(img, 0, 0);
            })    
        }
    }
    

const buildPdf = async (imageUrls) => {
    console.log('buildpdf imageUrls', imageUrls)
    startTime = new Date().getTime();
    await addSlidesToPDF(imageUrls);
    doc.end();
}