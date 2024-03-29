import DisciplinesType from "@/data/Disciplines.json"

type DisciplineType = {
	[key: string]: string;
};

const disciplines_dict: DisciplineType = {
	"Основы программирования и алгоритмизации": "ОПиА",
	"Открытые технологии разработки программного обеспечения": "ОТРПО",
	"Алгоритмы и технологии параллельных и распределенных вычислений": "АТПиРВ",
	"Компьютерное зрение": "КЗ",
};

export default disciplines_dict;
