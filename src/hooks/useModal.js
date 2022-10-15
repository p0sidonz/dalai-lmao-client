import { useState } from 'react';

export const useModal = (initialMode = false) => {
    const [modalOpen, setModalOpen] = useState(initialMode);
    const toggleModal = () => setModalOpen(!modalOpen);
    return [modalOpen, setModalOpen, toggleModal];
};

export const useModalWithData = (initialMode = false, initialSelected = null) => {
    const [modalOpen, setModalOpen] = useModal(initialMode);
    const [selected, setSelected] = useState(initialSelected);
    const setModalState = (state) => {
        setModalOpen(state);
        if (state === false) {
            setSelected(null);
        }
    };
    return { modalOpen, setModalOpen, selected, setSelected, setModalState };
};
