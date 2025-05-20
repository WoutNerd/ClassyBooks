import "../App.css";

const NoPage = () => {
    return ( 
        <h1>Deze pagina is niet gevonden.<br/> Hij is mogelijk verplaatst of nog in aanbouw.<br/> <button onClick={()=>{window.history.back()}} className="button">Ga terug</button></h1>
     );
}
 
export default NoPage;