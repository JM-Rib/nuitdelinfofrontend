import React from 'react';
import { Octokit } from '@octokit/core';
import './CodeOkKo.css';
import Bouton from '../components/Bouton';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/AuthProvider';
import deleteIcon from '../delete.png'
import {convertDateHuman, convertDateSql} from '../utils/dateConverter'

import { Panel } from 'primereact/panel';

import useApi from '../hooks/useApi';
import okKoApi from '../api/okKo'; //Import the API service function
import githubApi from '../api/github'; //Import the API service function

const ROW_AJOUT = 1;
function CodeOkKo(props) {
  const [editMode, setEditMode] = useState([]);

  const getCommitsApi = useApi(githubApi.getCommits);
  const getCommitContentsApi = useApi(githubApi.getCommitContents);
   
  useEffect(() => {
    getCommitsApi.request();
  }, []);

  useEffect(() => {
    if (!getCommitsApi.loading && getCommitsApi.data) {
      var tabEditMode = new Array(getCommitsApi.data.length + ROW_AJOUT).fill(false);
      setEditMode(tabEditMode);
    }
  }, [getCommitsApi.loading, getCommitsApi.data]); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sha = window.event.submitter.id.split('-')[0];
    const index = window.event.submitter.id.split('-')[1];

    //check submit type:
    if(window.event.submitter.name === "GET_CONTENT"){
      const response = await getCommitContentsApi.request(sha);
      console.log(getCommitContentsApi.data);
      var tabEditMode = new Array(editMode.length).fill(false);
      tabEditMode[index] = true;
      setEditMode(tabEditMode);
    }else if(window.event.submitter.name === "EDIT"){
    }
    //reset affichage du tableau apres envoi.
  }

  const createTournoi = async (data) => {
    try {
      await okKoApi.postTournoi(data);
      getCommitsApi.request();
    } catch (error) {
    }
  }
  
  const editTournoi = async (id, data) => {
    try {
      await okKoApi.putTournoi(id, data);
      getCommitsApi.request();
    } catch (err) {
      console.error(err);
    }
  }
  
  const removeTournoi = async (id) => {
    const choice = window.confirm("Êtes vous sûr de vouloir supprimer ce tournoi?\n\n\nUne fois supprimé tout les inscrits seront enlevés et il ne pourra plus être récupéré.");
    if (!choice) return;
    try {
      await okKoApi.deleteTournoi(id);
      getCommitsApi.request();
    } catch (error) {
    }
  }
  
  const annuler = () => {//reinitialise les champs d'edition.
    var tabEditMode = new Array(editMode.length).fill(false);//reset affichage du tableau apres envoi.
    setEditMode(tabEditMode);        
  }

	return (
    <div className="EspaceOkKo">
      <Bouton  nom="Accueil" type="lien" lien={"/index"}  />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <select name="nomTournoi" defaultValue={""}>
            <option value="JM-Rib" >JM-Rib</option>
            <option value="BastienTLC" >BastienTLC</option>
        </select>
        <table>
          <thead>
            <tr>
              <th className='tl-th th-visible'>Nom du dev</th>
              <th className='th-visible' >Message de la contribution</th>
              <th className='th-visible' >Date et Heure </th>
              <th className='tr-th  th-visible' ></th>
            </tr>
          </thead>
          <tbody>
            { getCommitsApi.data?.map( (commit, n) => ( 
              <>
              <tr key={"tabcommits-"+n} className="tr-visible"> 
                <td className='td-visible'> 
                  <div className="user-profile">
                    <img className="avatar-developpeur" src={commit.author.avatar_url} alt=""></img>
                    <p>{ commit.author.login } </p>
                  </div>
                </td> 
                <td className='td-visible'>
                  { commit.commit.message }</td>
                <td className='td-visible'>
                  { convertDateHuman(commit.commit.author.date)}
                </td>
                <td className='td-visible'>
                  <input type="submit" name="GET_CONTENT" value="Plus d'infos..." id={`${commit.sha}-${n}`}   />
                </td>
              </tr>
              {editMode[n]===true ? 
                <tr>
                  <td colSpan='4'>
                  {getCommitContentsApi.loading === false ? (
                    getCommitContentsApi.data.files.map( (fichier, i) => (
                      fichier.status==="modified" ?
                        <Panel header={fichier.filename + " ...  Modifié"} collapsed={true} toggleable >
                          <p className="m-0">
                            {fichier.patch?.split("\n").map( (ligne, j) => (
                              <>
                                <br />
                                {ligne}
                              </>
                            ))}
                          </p>
                        </Panel> 
                      :
                        <Panel header={fichier.filename + " ... Ajouté"} className="panel-ajout" collapsed={true} >
                        </Panel> 
                    ))
                  ) : (
                    "Chargement..."
                  )}
                  </td>
                </tr>
              :
                null
              }
              </>
              )) }
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default CodeOkKo;