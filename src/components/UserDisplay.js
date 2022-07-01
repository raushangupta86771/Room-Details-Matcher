import React from 'react'

const UserDisplay = (props) => {
    return (
        <>
            <div className='col-md-3'>
                <div className="card my-4">
                    <div className="card-body">
                        <img id='adjustImg' src={props.img} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDisplay