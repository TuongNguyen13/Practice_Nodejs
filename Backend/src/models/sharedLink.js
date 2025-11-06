import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Note from './notes.js';

const SharedLink = sequelize.define('SharedLink', {
  Id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  noteid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  Token: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  ReadOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'SharedLinks',
  timestamps: false,
  freezeTableName: true,
});

Note.hasOne(SharedLink, { foreignKey: 'NoteId', sourceKey: 'noteid' });
SharedLink.belongsTo(Note, { foreignKey: 'NoteId', targetKey: 'noteid' });

export default SharedLink;
