function  pages () {
	let width = screen.width
	let pagesize;
	switch(width){
		case 1680:
			pagesize = 12
			break
		case 1600:
		case 1440:
			pagesize = 10
			break
		case 1400:
			pagesize = 15
			break
		case 1366:
		case 1360:
			pagesize = 10
			break
		default:
			pagesize = 15
	}
	return pagesize;
}

export default pages