import React, {useEffect} from 'react';
import Domaine from "../api/model/Domaine";
import Demande from "../api/model/Demande";
import Association from "../api/model/Association";
import { useState } from 'react';
import toast from 'react-hot-toast';
import Api from '../api/Api';
import Select from 'react-select';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const DemandeFormation = () => {
    {/* state formulaire */}
    const [sujet, setSujet] = useState('');
    const [detail, setDetail] = useState('');
    const [domaines, setDomaines] = useState([]);
    const [hasUnfilled, setHasUnfilled] = useState({});
    const [options, setOptions] = useState([]);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleSubmit = () => {
        console.log("Handle submit");
        let demande = mapFormToDemande();

    }

    const mapFormToDemande = () => {
        let demande = new Demande()
        let domainesArr = []
        demande.sujet = sujet;
        demande.detail = detail;
        let association = new Association();
        association.email = 'AMB@yopmail.fr'
        demande.association = association;
        domaines.forEach(element => {
            let domaine = new Domaine();
            domaine.code = element.value;
            domainesArr.push(domaine);
        })
        demande.domaines = domainesArr;
        return demande;
    }

    const resetForm = () => {
        setSujet('');
        setDetail('');
        setHasUnfilled({});
        setDomaines([]);
    }

    const validate = () => {
        
        let hasUnfilled = {};
        let isValid = true;
        
        if (!sujet) {
            isValid = false;
            hasUnfilled["sujet"] = "Renseigner un sujet.";
        }
        if (!detail) {
            isValid = false;
            hasUnfilled["detail"] = "Renseigner les détails de la demande.";
        }
        if (domaines.length === 0) {
            isValid = false;
            hasUnfilled["domaines"] = "Renseigner au moins un domaine.";
        }
        if (isValid) {
            handleSubmit();
        }
        else {
            setHasUnfilled(hasUnfilled);
        }
    }

    useEffect(() => {
        
        let isMounted = true;
        let optionsArray = []
        const controller = new AbortController();

        const getDomaines = async () => {
            try {
                const response = await axiosPrivate.get('/data/domaines', {
                    signal: controller.signal,
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });
                for (const element of response.data) {
                    optionsArray.push({value: element.code, label:element.libelle});
                    }
                console.log(response.data);
                isMounted && setOptions(optionsArray);
            } catch (err) {
                console.error(err);
                navigate('/connexion', { state: { from: location }, replace: true });
            }
        }

        getDomaines();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <div className="DemandeFormation">
            <div className="row justify-content-md-center  mt-3">
                <div className="col col-lg-5 border border-dark">
                    <h1 className="justify-content-center align-items-center">
                        <u>DEMANDE DE FORMATION</u>
                    </h1>
                </div>
            </div>
            <div className="row justify-content-md-center mt-3">
                <div className="col col-lg-5 ">
                    <form>
                        <div className="form-group">
                            <label htmlFor="name" className="mt-2 mb-2">Indiquez le ou les domaines de formation ?</label>
                            <SelectComp domaines={domaines} options={options} handleChange={setDomaines}/>
                            <div className="text-danger">{hasUnfilled.domaines}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="sujet" className="mt-2">Indiquez le sujet de la formation</label>
                            <input
                                type="text"
                                name="sujet"
                                value={sujet}
                                onChange={event => setSujet(event.target.value)}
                                className="form-control mt-2"
                                placeholder="Ex : Trésorie"
                                id="email"/>
                            <div className="text-danger">{hasUnfilled.sujet}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="detail" className="mt-2">Ajoutez des détails sur votre demande de
                                formation</label>
                            <textarea
                                name="detail"
                                value={detail}
                                onChange={event => setDetail(event.target.value)}
                                placeholder="Date, déroulement, pré-requis, ..."
                                className="form-control mt-2"
                                rows="7"/>
                            <div className="text-danger">{hasUnfilled.detail}</div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <div className="p-2">
                                <input type="button" value="Valider" className="btn btn-primary" onClick={validate}/>
                            </div>
                            <div className="p-2">
                                <input type="button" value="Reset" className="btn btn-primary" onClick={resetForm}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DemandeFormation;

const SelectComp = ({ domaines, options, handleChange }) => {

    return (
        <Select
            isMulti 
            isClearable
            isSearchable={false}  
            defaultValue={domaines}
            value={domaines}
            placeholder="Veuillez selectionner au moins un domaine"
            onChange={handleChange}
            options={options}
        />
    );
}



