/* eslint-disable react/button-has-type */
// Example from https://beta.reactjs.org/learn

import React, { useState } from "react";
import styles from "./counters.module.css";

const MyButton = () => {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    return (
        <div>
            <button onClick={handleClick} className={styles.counter}>
                Clicked {count} times
            </button>
        </div>
    );
};

// eslint-disable-next-line react/function-component-definition
export default function MyApp() {
    return <MyButton />;
}
