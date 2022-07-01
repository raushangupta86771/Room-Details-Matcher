import React from 'react'

const displayMatches = (props) => {
    return (
        <>
            <div className='col-md-3'>
                <div className="card my-4">
                    <div className="card-body">
                        <h5 className="card-title">{props.name}</h5>
                        <img id='adjustImg' src={props.imgSrc} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default displayMatches