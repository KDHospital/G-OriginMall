const ProducstListHeader = ({title,desc}) => {
    return(
            <div>
                <h1 className="font-newsreader text-4xl font-bold text-primary mb-2">{title}</h1>
                <p className="font-manrope text-on-surface-variant">{desc} </p>
            </div>
    )
}
export default ProducstListHeader