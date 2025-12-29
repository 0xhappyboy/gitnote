import React from "react"
import TopArea from "../components/top/TopArea"
import MiddleArea from "../components/center/MiddleArea"

class MainLayout extends React.Component {
    render() {
        return (
            <>
                <TopArea />
                <MiddleArea >
                </MiddleArea>
            </>
        )
    }
}

export default MainLayout