import { z } from 'zod';

const HistoryParamDTO = z.object({
	id: z.coerce.number(),
	period: z.enum(['daily', 'hourly', 'minute']),
});

export default HistoryParamDTO;
