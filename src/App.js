import './App.css';
import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function App() {

  const [characters, setCharacters] = useState([]);
  const [charactersLoaded, setCharactersLoaded] = useState(false);

  const [progress, setProgress] = useState(0);
  const [randomIDs, setRandomIDs] = useState([]);
  const [randomIDsLoaded, setRandomIDsLoaded] = useState(false);

  const [randomCharacter, setRandomCharacter] = useState(Math.floor(Math.random() * 4) + 1);

  const [gif, setGif] = useState(null);
  const [launchRandomGif, setLaunchRandomGif] = useState(false);
  const [renderGift, setRenderGift] = useState(true);

  useEffect(() => {
    const createRandomIDs = () => {
      const updateRandomIDs = [...randomIDs];
      const randomID = Math.floor(Math.random() * 826) + 1;
      if (!randomIDs.includes(randomID)){
        updateRandomIDs.push(randomID);
        setRandomIDs(updateRandomIDs);
      }
      }
    if (randomIDs.length < 5) {createRandomIDs();} else {setRandomIDsLoaded(true)};
  }, [randomIDs]);
  

  useEffect(() => {
    const fetchData = async () => {
      const URL = "https://rickandmortyapi.com/api/character/" + randomIDs.join(',');
      const response = await fetch(URL);
      const data = await response.json();
      setCharacters(data);
      setCharactersLoaded(true);
      console.log(data);
    };
  
    if (!charactersLoaded && randomIDsLoaded) {fetchData()};
  }, [charactersLoaded, randomIDs, randomIDsLoaded]);
      
  const handleClick = (index) => {
    if (0 <= progress) {
      if (index === randomCharacter){
        setRandomIDs([]);
        setRandomCharacter(Math.floor(Math.random() * 4) + 1)
        setRandomIDsLoaded(false);
        setCharactersLoaded(false);
        setProgress(progress+10);
        setRenderGift(true);
        setGif(null);
        setLaunchRandomGif(false);
      }
      else {
        alert("Try again!")
      }
    }
  };

  const handleAgain = () => { setProgress(0); };

  const openGift = () => { 
    setLaunchRandomGif(true); 
    setRenderGift(false);
  };

  useEffect(() => {
    const fetchGif = async () => {
      const URL = "https://api.giphy.com/v1/gifs/random?api_key=0UTRbFtkMxAplrohufYco5IY74U8hOes&tag=fail&rating=pg-13";
      const response = await fetch(URL);
      const data = await response.json();
      setGif(data);
      console.log(data);
      setLaunchRandomGif(false);
    };
  
    if (launchRandomGif) {fetchGif()};
  }, [launchRandomGif, gif]);

  return (
    <div>
      <h2 style={{textAlign:"center", marginTop:"3vmin"}}>Guess 10 characters and win something!</h2>
      <div className="center-content">
        <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%`}}></div>
        </div>
      </div>
      <table className="table" style={{textAlign:"center", marginTop:"3vmin"}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Species</th>
            <th>Type</th>
            <th>Gender</th>
          </tr>
        </thead>
        {charactersLoaded && progress < 100 && 
        <tbody>
          <tr>
            <td>{characters[randomCharacter].name}</td>
            <td>{characters[randomCharacter].status}</td>
            <td>{characters[randomCharacter].species}</td>
            <td>{characters[randomCharacter].type}</td>
            <td>{characters[randomCharacter].gender}</td>
          </tr>
        </tbody>}
      </table>
      <div className="characters">
        {charactersLoaded && progress < 100 && characters.map((character, index) => (
          <Card style={{ margin: "3vmin" }} key={character.id}>
            <Card.Img style={{ cursor: "pointer" }} src={character.image} onClick={() => handleClick(index)} alt={character.name} />
          </Card>
        ))}
      </div>
      <div >
        {progress === 100 && 
        <div>
          {renderGift && (
            <div style={{textAlign:"center"}}>
              <h4 style={{marginBottom:"2vmin"}}>You won! Open your gift!</h4>
              <img onClick={openGift} style={{height:"18vmin", marginBottom:"5vmin", cursor:"pointer"}} src="https://media4.giphy.com/media/fjxeswpTKg3Uy2INQx/giphy.gif" alt="gift"></img>
            </div>
            
          )}
          
          {gif !== null && (
            <div style={{textAlign:"center"}}>
              <h4 style={{marginBottom:"2vmin"}}>Here's a random gif!</h4>
              <img style={{height:"25vmin", marginBottom:"5vmin"}} src={gif.data.images.original.url} alt="random-gif"></img>
            </div>
   
          )}
          <div className="center-content"> 
            <Button onClick={handleAgain}>Again!</Button>
          </div>
          
        </div>}
      </div>
         
    </div>
  );
}

export default App;
