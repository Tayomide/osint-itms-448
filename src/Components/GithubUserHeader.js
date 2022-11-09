import styled from "styled-components"
import GitHubIcon from '@mui/icons-material/GitHub';

export const GithubUserHeader = ({userName, data, url}) => {
  // JSON.stringify(data, null, 2)
  // "\n // Followers \n" + JSON.stringify(response, null, 2)
  const handleClickOne = (e) => {
    var a = document.createElement("a");
    let content = ""
    for(let name in data){
      content += `// ${name} \n` + JSON.stringify(data[name], null, 2) + "\n"
    }
    var file = new Blob([content], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = userName + "_OSINT_Data";
    a.click();
  }

  const handleClickMultiple = (e) => {
    var a = document.createElement("a");
    let content = ""
    for(let name in data){
      content = `// ${name} \n` + JSON.stringify(data[name], null, 2)
      var file = new Blob([content], {type: "application/json"});
      a.href = URL.createObjectURL(file);
      a.download = userName + "_" + name;
      a.click();
    }
  }
  return (
    <Container>
      <div>
        <GitHubIcon sx={{
          width: 35,
          height: 35
        }}/>
        <a className="name" href={url} target="_blank" rel="noreferrer">{userName}</a>
      </div>
      
      <div className="link-container">
        <button onClick={handleClickOne}>Download all datatest</button>
        <button onClick={handleClickMultiple}>Download individual dataset</button>
      </div>
    </Container>
  )
}

const Container = styled.nav`
  display: flex;
  flex-direction: row;
  height: 3em!important;
  width: 100%;
  padding: 0 0.2em;
  align-items: center;
  justify-content: space-between;
  div{
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .link-container{
    margin-right: 1em;
  }
  svg{
    margin: 0 0.3em;
  }
  .name{
    height: max-content;
    font-size: 1.3em;
    font-weight: bold;
    color: #000000;
  }
  button:not([class="name"]){
    align-items: center;
    background-color: #000000;
    border-radius: 0.2em;
    color: #ffffff;
    display: flex;
    font-size: 1em;
    height: 80%;
    margin-left: 1em;
    padding: 0 1em;
  }
`

