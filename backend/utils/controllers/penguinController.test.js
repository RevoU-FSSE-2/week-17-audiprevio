const { addPenguinData, getAllPenguinData, updatePenguinData } = require('../../controllers/penguinController');

jest.mock('../../models/allModel', () => {
  const mockPenguinData = {
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn()
  };

  const mockHistoricalPosition = {};

  function MockPenguinData() {
    return this;
  }
  MockPenguinData.prototype.save = jest.fn();

  function MockHistoricalPosition() {
    this.penguinData = 'test'; 
    this.penguinNameRec = 'test'; 
    this.previousPenguinPosition = [0, 0];
    this._id = 'test'; 
    this.__v = 0;
    this.save = jest.fn().mockResolvedValue(this);
  }
  
   
  
  return {
    penguinData: Object.assign(MockPenguinData, mockPenguinData),
    historicalPosition: Object.assign(MockHistoricalPosition, mockHistoricalPosition)
  };
});


const { penguinData: mockPenguinData, historicalPosition: mockHistoricalPosition } = require('../../models/allModel');

describe('penguinController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('addPenguinData', async () => {
    const req = { body: { penguinName: 'test', lastPosition: [0, 0], lastUpdate: 'test', speciesName: 'test', ageAtTagging: 'test', taggedPosition: 'test', taggedTime: 'test', taggedBy: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    mockPenguinData.findOne.mockResolvedValue(null);
  
    await addPenguinData(req, res);
  
    expect(mockPenguinData.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'New penguin data added successfully - wenk wenk!' });
  });

  test('getAllPenguinData', async () => {
    const res = { json: jest.fn() };
    const penguins = [{ penguinName: 'test' }];
    mockPenguinData.find.mockResolvedValue(penguins);

    await getAllPenguinData({}, res);

    expect(mockPenguinData.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(penguins);
  });

  test('updatePenguinData', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const req = { 
      body: { lastPosition: [0, 0] },
      params: { id: 'test' }
    };
    const penguin = { _id: 'test', penguinName: 'test', lastPosition: [0, 0] };
    const historicalPos = { penguinData: penguin._id, penguinNameRec: penguin.penguinName, previousPenguinPosition: [...penguin.lastPosition], _id: 'test', __v: 0 };
    
    mockPenguinData.findOneAndUpdate.mockResolvedValue({
      _id: 'test',
      penguinName: 'test',
      lastPosition: [0, 0]
    });
  
    const mockHistoricalPositionInstance = new mockHistoricalPosition();
    mockHistoricalPositionInstance.save.mockImplementation(() => {
      const newHistoricalPos = new MockHistoricalPosition();
      newHistoricalPos.penguinData = 'test'; 
      newHistoricalPos.penguinNameRec = historicalPos.penguinNameRec;
      newHistoricalPos.previousPenguinPosition = historicalPos.previousPenguinPosition;
      newHistoricalPos._id = historicalPos._id;
      newHistoricalPos.__v = historicalPos.__v;
      return Promise.resolve(newHistoricalPos);
    });
    
    await updatePenguinData(req, res);
  
    expect(mockPenguinData.findOneAndUpdate).toHaveBeenCalledWith({ _id: req.params.id }, { lastPosition: req.body.lastPosition }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    
    expect(res.json).toHaveBeenCalled();
    const resJsonCallArg = res.json.mock.calls[0][0];
    expect(resJsonCallArg.message).toEqual('Penguin data updated successfully');
    expect(resJsonCallArg.penguin).toEqual(penguin);
    expect(resJsonCallArg.historicalPositionMessage).toEqual("Historical Position of Penguin is also recorded");
    expect(resJsonCallArg.historicalPos.penguinData).toEqual(historicalPos.penguinData);
    expect(resJsonCallArg.historicalPos.penguinNameRec).toEqual(historicalPos.penguinNameRec);
    expect(resJsonCallArg.historicalPos.previousPenguinPosition).toEqual(historicalPos.previousPenguinPosition);
    expect(resJsonCallArg.historicalPos._id).toEqual(historicalPos._id);
    expect(resJsonCallArg.historicalPos.__v).toEqual(historicalPos.__v);
  });           
});
