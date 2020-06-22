
function getInfo(parm = {}) {
    API_BASE.index(parm)
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    });
}
getInfo({})
// getInfo(parm);
