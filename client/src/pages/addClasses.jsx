import "../App.css"
import React, { useState } from "react";
const [isSubmitted, setIsSubmitted] = useState(false);
const submit =(event) => {
    event.preventDefault();
    var { name, url } = document.forms[0];
    console.log(document.forms[0]);
}


const renderForm = (
    <div className="form">
      <form onSubmit={submit}>
        <div className="input-container">
          <input type="text" name="name" required placeholder="Naam van de klas" />
        </div>
        <div className="input-container">
          <input type="url" name="url"  placeholder="Link naar de afbeelding voor de klas" />
        </div>
        <div className="button-container">
          <input type="submit" value={"Voeg toe"} className="login-button"/>
        </div>
      </form>
    </div>)

const AddClasses = () => {
    return ( 
        <div>
            {isSubmitted ? window.location.replace("overzicht") : renderForm}
        </div>
     );
}
 
export default AddClasses;