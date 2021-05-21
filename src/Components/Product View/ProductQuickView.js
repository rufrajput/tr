import React, { useState } from 'react'
import QuickView from '../../Pages/Sections/QuickView';

const ProductView = () => {
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        setShowModal(true);
    }
    const handleHideModal = () => {
        setShowModal(false);
    }
    return (

        <>
            <div className="mt-button quick-view">
                <Link>
                    <i className="fa fa-search" onClick={handleShowModal} ></i>
                    {showModal ?
                        (<QuickView showModal={showModal} hideModal={handleHideModal} />)
                        : null}
                </Link>
            </div>

        </>
    )
}

export default ProductView;

