import "../App.css"

// class names
const classNames = [
{name :"wolfklas",imgUrl: "https://img.static-rmg.be/a/view/q75/w1200/h800/3438717/88d668dab0dc1a68da347f15bf0b85fe-jpg.jpg",},
{name :"girafklas", imgUrl: "https://d33b12c77av9bg.cloudfront.net/originals/veulen-giraffen-max-jacques-beeksebergen-resort-safari-giraffe.jpg"},
{name :"girafklas", imgUrl: "https://d33b12c77av9bg.cloudfront.net/originals/veulen-giraffen-max-jacques-beeksebergen-resort-safari-giraffe.jpg"},
];

const Class = () => {
    return ( 
         <div className="klas">
            <ul className="klas">
            {classNames.map((item)=>{
                 return (
                  <li className="klas">{item.name} <br />
                  <img src={item.imgUrl} alt="" />
                  </li>
                 )
               })}
            </ul>
        </div>
     );
}
 
export default Class;