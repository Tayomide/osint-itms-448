import styled from "styled-components"
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useParams } from "react-router-dom"

export const GithubUserData = ({data}) => {
  const params = useParams()
  const handleClickOne = (queryType) => {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(data[queryType], null, 2)], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = params.user+ "'s " + queryType.split("User's ").join("") + "_Data";
    a.click();
  }
  return(
    <Container>
      <p>Export User Data</p>
      <ul>
        {
          Object.keys(data).map((key, idx) => <li key={idx}>
            <p>{key}</p>
            <button onClick={() => handleClickOne(key)}><FileDownloadOutlinedIcon /></button>
          </li>)
        }
      </ul>
    </Container>
  )
}

const Container = styled.li`
  border: 1px solid #efefef;
  border-radius: 0.4em;
  width: 100%;
  padding: 1em;
  > p{
    padding: 0 0 0.6em 0;
    font-size: 1.1em;
    font-weight: bold;
  }
  ul{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1em;
    li{
      align-items: center;
      border: 1px solid #efefef;
      border-radius: 0.4em;
      padding: 0.4em;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      button{
        height: min-content;
        svg{
          height: auto;
          height: min-content;
        }
      }
    }
    @media screen and (max-width: 400px){
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
  }
`