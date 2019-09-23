export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeTitle: string,
    public placeImageUrl: string,
    public firstName: string,
    public lastName: string,
    public guestNumber: number,
    public dateFrom: Date,
    public dateTo: Date
  ) {}
}
