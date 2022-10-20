const UserTypeChose = () => {

    const leerkracht = () => {
        console.log('leerkracht');
    }

    const leerling = () => {
        console.log('leerling');
    }

    return ( 
        <div className="userTypeChose">
            <button onClick={ leerkracht }>Leerkracht</button>
            <button onClick={ leerling }>Leerling</button>
        </div>
     );
}
 
export default UserTypeChose;