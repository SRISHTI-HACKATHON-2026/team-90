from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True)
    area = Column(String)


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String)
    resource = Column(String)
    value = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)


class DailyCIU(Base):
    __tablename__ = "daily_ciu"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    water = Column(Integer)
    waste = Column(Integer)
    energy = Column(Integer)
    ciu_score = Column(Integer)
    status = Column(String)