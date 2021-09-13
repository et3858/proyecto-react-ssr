import React from "react";

const Home = (props) => {
    return (
        <>
            <h1>Error 404</h1>
            <p>
                No se encuentra la página
            </p>
            <p>
                <button
                    type="button"
                    onClick={() => props.history.goBack()}
                >
                    Volver a la página anterior
                </button>
            </p>
        </>
    );
};

export default Home;
