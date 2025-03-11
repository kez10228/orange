const OfflinePresence = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 10 10" fill="none" className='offline'>
            <circle cx={5} cy={5} r={5} fill="#D9D9D9" />
            <g style={{ mixBlendMode: "plus-darker" }}>
                <circle cx={5} cy={5} r={2} fill="#80848E" />
            </g>
        </svg>
    )
}

export default OfflinePresence