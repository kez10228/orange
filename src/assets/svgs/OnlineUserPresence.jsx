const OnlineUserPresence = () => {
    return (
        <svg y={17} width={25} height={15} className="online" viewBox="0 0 25 15">
            <mask id=":r3:">
                <rect x="7.5" y={5} width={10} height={10} rx={5} ry={5} fill="white" />
                <rect x="12.5" y={10} width={0} height={0} rx={0} ry={0} fill="black" />
                <polygon
                    points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
                    fill="black"
                    transform="scale(0) translate(13.125 10)"
                    style={{ transformOrigin: "13.125px 10px" }}
                />
                <circle fill="black" cx="12.5" cy={10} r={0} />
            </mask>
            <rect fill="#23a55a" width={25} height={15} mask="url(#:r3:)" />
        </svg>
    )
}

export default OnlineUserPresence