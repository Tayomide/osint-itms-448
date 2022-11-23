import React from 'react'
import styled from 'styled-components'
import { SmartCarouselP } from './SmartCarouselP'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

export const SmartCarouselChild = ({obj, type}) => {
  const handleClickOne = (queryType) => {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = obj[queryType] + "_OSINT_Repo_Data";
    a.click();
  }
  return (
    <Container>
      {type === "user"?
      <>
        <div className="header">
          <p>
            <img src={obj["avatarUrl"]} alt="user icon" />
            <a href={obj["url"]} target="_blank" rel="noreferrer">{obj["user name"]}</a>
          </p>
          <button onClick={() => handleClickOne("user name")}><FileDownloadOutlinedIcon /></button>
        </div>
        {/* Make the generic p tags into a component */}
        <SmartCarouselP name={"followers"} value={obj["followers"]} />
        <SmartCarouselP name={"following"} value={obj["following"]} />
        <SmartCarouselP name={"organizations"} value={obj["organizations"]} />
        <SmartCarouselP name={"repositories"} value={obj["repositories"]} />
        <SmartCarouselP name={"data used"} value={obj["data used"]} />
      </> : type === "repo"?
      <>
        <p className='header'>
          <a href={obj["url"]} target="_blank" rel="noreferrer">{obj["name"]}</a>
          <button onClick={() => handleClickOne("name")}><FileDownloadOutlinedIcon /></button>
        </p>
        <SmartCarouselP name={"created"} value={obj["created"]} />
        <SmartCarouselP name={"data used"} value={obj["data used"]} />
        <SmartCarouselP name={"forks"} value={obj["forks"]} />
        <SmartCarouselP name={"visibility"} value={obj["visibility"]} />
      </> :
      <p>{JSON.stringify(obj)}</p>
      }
    </Container>
  )
}

const Container = styled.li`
  align-content: flex-start;
  border: 1px solid #e6e6e6;
  border-radius: 0.3em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 13em;
  min-width: 25em;
  padding: 1em 0.8em 0.3em 0.8em;
  gap: 0.6em 0.4em;
  .header{
    height: max-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding-bottom: 0.5em;
    font-size: 0.9em;
    justify-content: space-between;
    >p{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    img{
      height: 2.45em;
      border-radius: 50%;
    }
    a{
      font-size: 1.5em;
      color: #161656;
      padding-left: 0.4em;
      font-weight: bold;
    }
    button{
      align-items: center;
      border: 1px solid #e7e7e7;
      border-radius: 0.3em;
      display: inline-flex;
      font-size: 1em;
      font-weight: bold;
      height: 2.3em;
      justify-content: center;
      padding: 0 0.4em 0 0.4em;
    }
  }
`
